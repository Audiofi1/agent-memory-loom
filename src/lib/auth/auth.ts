import { createServerFn } from "@tanstack/react-start";
import { fromBase64 } from "@mysten/bcs";
import { normalizeSuiAddress } from "@mysten/sui/utils";

/**
 * Server-verified "Sign-In with Sui" (SIWS).
 * Wallet connect is the primary gate; this seals an httpOnly session when the
 * wallet signature succeeds (best-effort, non-blocking for dashboard access).
 */

const SESSION_NAME = "narwhal_auth";
const CHALLENGE_TTL_MS = 5 * 60 * 1000;

const SESSION_PASSWORD =
  (typeof process !== "undefined" && process.env?.SESSION_SECRET) ||
  "narwhal-dev-session-secret-please-override-in-production-env";

type AuthSession = {
  address?: string;
  nonce?: string;
  issuedAt?: number;
  verified?: boolean;
};

function sessionConfig() {
  return {
    name: SESSION_NAME,
    password: SESSION_PASSWORD,
    cookie: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: typeof process !== "undefined" && process.env?.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  };
}

async function getAppSession() {
  const { useSession } = await import("@tanstack/react-start/server");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSession<AuthSession>(sessionConfig());
}

function buildSignInMessage(address: string, nonce: string, issuedAt: number) {
  return [
    "narwhal.app wants you to sign in with your Sui account:",
    address,
    "",
    "Sign this message to verify wallet ownership and open a secure session.",
    "This request will not trigger a blockchain transaction or cost any gas.",
    "",
    `Nonce: ${nonce}`,
    `Issued At: ${new Date(issuedAt).toISOString()}`,
  ].join("\n");
}

export const getAuthChallenge = createServerFn({ method: "POST" })
  .inputValidator((address: unknown) => {
    if (typeof address !== "string" || address.length < 3) {
      throw new Error("A wallet address is required.");
    }
    return normalizeSuiAddress(address);
  })
  .handler(async ({ data: address }) => {
    const session = await getAppSession();
    if (
      session.data.verified &&
      session.data.address &&
      normalizeSuiAddress(session.data.address) === address
    ) {
      return { message: "", alreadyVerified: true as const };
    }
    const { randomBytes } = await import("node:crypto");
    const nonce = randomBytes(24).toString("hex");
    const issuedAt = Date.now();
    await session.update({ address, nonce, issuedAt, verified: false });
    return { message: buildSignInMessage(address, nonce, issuedAt), alreadyVerified: false as const };
  });

export const verifySignIn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const v = input as { address?: unknown; signature?: unknown; messageBytes?: unknown };
    if (typeof v?.address !== "string" || typeof v?.signature !== "string") {
      throw new Error("address and signature are required.");
    }
    if (typeof v.messageBytes !== "string" || v.messageBytes.length < 4) {
      throw new Error("messageBytes are required.");
    }
    return {
      address: normalizeSuiAddress(v.address),
      signature: v.signature,
      messageBytes: v.messageBytes,
    };
  })
  .handler(async ({ data }) => {
    const session = await getAppSession();
    const { address, nonce, issuedAt } = session.data;

    if (!nonce || !address || !issuedAt || normalizeSuiAddress(address) !== data.address) {
      throw new Error("No active sign-in challenge — please try again.");
    }
    if (Date.now() - issuedAt > CHALLENGE_TTL_MS) {
      await session.clear();
      throw new Error("Sign-in challenge expired — please try again.");
    }

    const expected = buildSignInMessage(address, nonce, issuedAt);
    const signedBytes = fromBase64(data.messageBytes);
    const signedText = new TextDecoder().decode(signedBytes);
    if (signedText !== expected) {
      throw new Error("Signed message does not match the active challenge — please try again.");
    }

    const { verifyPersonalMessageSignature } = await import("@mysten/sui/verify");
    let publicKey;
    try {
      publicKey = await verifyPersonalMessageSignature(signedBytes, data.signature);
    } catch {
      throw new Error("Signature verification failed.");
    }

    if (normalizeSuiAddress(publicKey.toSuiAddress()) !== data.address) {
      throw new Error("Signature does not match the connected wallet.");
    }

    await session.update({
      address,
      verified: true,
      nonce: undefined,
      issuedAt,
    });
    return { address, verified: true as const };
  });

export const fetchSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAppSession();
  if (session.data.verified && session.data.address) {
    return { address: normalizeSuiAddress(session.data.address), verified: true as const };
  }
  return { address: null, verified: false as const };
});

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAppSession();
  await session.clear();
  return { ok: true as const };
});
