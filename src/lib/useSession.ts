import { useEffect, useState } from "react";
import { useCurrentAccount, useAutoConnectWallet } from "@mysten/dapp-kit";

/**
 * Wallet connection state for gating UI.
 *
 * Critical: we stay `isInitializing` until dapp-kit's auto-connect has actually
 * SETTLED. `useAutoConnectWallet()` returns "idle" while a silent reconnect is
 * still in flight — flipping `isInitializing` to false during that window made
 * the dashboard flash its "connect wallet" gate even though the wallet was about
 * to reconnect a tick later. Only "attempted"/"disabled" mean the wallet state
 * is final, so we wait for those before revealing the gate.
 */
export function useSession() {
  const account = useCurrentAccount();
  const autoConnect = useAutoConnectWallet(); // "disabled" | "idle" | "attempted"
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (autoConnect !== "idle") {
      setIsInitializing(false);
    }
  }, [autoConnect]);

  // Convenience-only cookie (never used for gating decisions). Set it when
  // connected, clear it once auto-connect has settled with no wallet.
  useEffect(() => {
    if (account) {
      document.cookie = `narwhal_session=${account.address}; path=/; max-age=86400; SameSite=Lax`;
    } else if (autoConnect !== "idle") {
      document.cookie = "narwhal_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [account, autoConnect]);

  return {
    account,
    isInitializing,
    isConnected: !!account,
  };
}
