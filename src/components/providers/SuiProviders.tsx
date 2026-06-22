import { type ReactNode } from "react";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { ACTIVE_NETWORK, networkConfig } from "@/lib/sui-config";

export function SuiProviders({ children }: { children: ReactNode }) {
  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork={ACTIVE_NETWORK}>
      <WalletProvider autoConnect>{children}</WalletProvider>
    </SuiClientProvider>
  );
}
