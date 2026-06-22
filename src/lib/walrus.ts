import { WALRUS_AGGREGATOR, WALRUS_PUBLISHER } from "./sui-config";

export type WalrusStoreResult = {
  blobId: string;
  status: "created" | "certified";
  endEpoch?: number;
  suiObjectId?: string;
  raw: unknown;
};

/**
 * Store a string payload as a blob on Walrus testnet via the public HTTP
 * publisher. See https://docs.wal.app/docs/getting-started
 */
export async function storeBlob(content: string, epochs = 5): Promise<WalrusStoreResult> {
  const res = await fetch(`${WALRUS_PUBLISHER}/v1/blobs?epochs=${epochs}`, {
    method: "PUT",
    body: new TextEncoder().encode(content),
  });

  if (!res.ok) {
    throw new Error(`Walrus publisher error ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as any;

  if (data.newlyCreated) {
    const obj = data.newlyCreated.blobObject;
    return {
      blobId: obj.blobId,
      status: "created",
      endEpoch: obj.storage?.endEpoch,
      suiObjectId: obj.id,
      raw: data,
    };
  }
  if (data.alreadyCertified) {
    return {
      blobId: data.alreadyCertified.blobId,
      status: "certified",
      endEpoch: data.alreadyCertified.endEpoch,
      suiObjectId: data.alreadyCertified.event?.txDigest,
      raw: data,
    };
  }
  throw new Error("Unexpected Walrus response shape");
}

/** Read a blob's raw text back from the Walrus aggregator. */
export async function readBlob(blobId: string): Promise<string> {
  const res = await fetch(`${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`);
  if (!res.ok) {
    throw new Error(`Walrus aggregator error ${res.status}`);
  }
  return res.text();
}

export function walrusBlobUrl(blobId: string) {
  return `${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`;
}

/** SHA-256 hash of a string, hex-encoded — used for tamper-evidence. */
export async function sha256Hex(content: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
