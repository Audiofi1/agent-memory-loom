import { useCallback, useEffect, useRef, useState } from "react";
import { useCurrentAccount, useSignPersonalMessage } from "@mysten/dapp-kit";
import { normalizeSuiAddress } from "@mysten/sui/utils";
import { getAuthChallenge, verifySignIn, fetchSession, signOut as signOutFn } from "./auth";

/**
 * Wallet connect = logged in for the UI (matches reference app).
 * Server session is sealed in the background when the wallet signature succeeds.
 */
export type AuthState = ReturnType<typeof useAuthState>;

export function useAuthState() {
  const account = useCurrentAccount();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();

  const [verifiedAddress, setVerifiedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const signInAttempted = useRef<string | null>(null);
  const signInInFlight = useRef(false);

  const addr = account ? normalizeSuiAddress(account.address) : null;

  const refresh = useCallback(async () => {
    if (!account || !addr) {
      setVerifiedAddress(null);
      setSessionChecked(true);
      setSessionError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSessionError(null);
    setSessionChecked(false);
    try {
      const s = await fetchSession();
      setVerifiedAddress(s.verified ? s.address : null);
      setSessionChecked(true);
    } catch (err) {
      setSessionError(err instanceof Error ? err.message : "Failed to reach server");
      setSessionChecked(true);
    } finally {
      setLoading(false);
    }
  }, [account, addr]);

  useEffect(() => {
    if (!account) {
      setVerifiedAddress(null);
      setSessionChecked(true);
      setSessionError(null);
      setLoading(false);
      signInAttempted.current = null;
      return;
    }
    if (verifiedAddress === addr && sessionChecked) return;
    void refresh();
  }, [account?.address, addr, refresh, verifiedAddress, sessionChecked]);

  const signIn = useCallback(async () => {
    if (!account || !addr) throw new Error("Connect a wallet first.");
    if (signInInFlight.current) return;
    signInInFlight.current = true;
    setSigningIn(true);
    setSessionError(null);
    try {
      const challenge = await getAuthChallenge({ data: addr });
      if (challenge.alreadyVerified) {
        setVerifiedAddress(addr);
        setSessionChecked(true);
        return { address: addr, verified: true as const };
      }

      const bytes = new TextEncoder().encode(challenge.message);
      const { signature, bytes: messageBytes } = await signPersonalMessage({ message: bytes });
      const res = await verifySignIn({
        data: { address: addr, signature, messageBytes },
      });
      setVerifiedAddress(res.address);
      setSessionChecked(true);
      return res;
    } catch (err) {
      signInAttempted.current = null;
      const message = err instanceof Error ? err.message : "Sign-in failed";
      setSessionError(message);
      throw err;
    } finally {
      signInInFlight.current = false;
      setSigningIn(false);
    }
  }, [account, addr, signPersonalMessage]);

  const signOut = useCallback(async () => {
    try {
      await signOutFn();
    } finally {
      setVerifiedAddress(null);
      setSessionChecked(true);
      signInAttempted.current = null;
    }
  }, []);

  const connected = !!account;
  const verified = connected && !!addr && verifiedAddress === addr;

  return {
    account,
    connected,
    verified,
    verifiedAddress,
    loading,
    signingIn,
    sessionChecked,
    sessionError,
    signIn,
    signOut,
    refresh,
  };
}
