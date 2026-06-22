import { useEffect, type ReactNode } from "react";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { registerSlushWallet } from "@mysten/slush-wallet";
import { ACTIVE_NETWORK, networkConfig } from "@/lib/sui-config";

/**
 * Wires the app to Sui + registers Slush (Sui's official web wallet) so a
 * real Sui wallet is always available — no browser extension required.
 */
export function SuiProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      const { unregister } = registerSlushWallet("Narwhal", {
        origin: "https://my.slush.app",
      });
      return unregister;
    } catch {
      // Already registered or unsupported environment — safe to ignore.
    }
  }, []);

  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork={ACTIVE_NETWORK}>
      <WalletProvider autoConnect>{children}</WalletProvider>
    </SuiClientProvider>
  );
}
