import { useState } from "react";
import {
  ConnectModal,
  useCurrentAccount,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import { Wallet, LogOut, Copy, Check } from "lucide-react";

function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function WalletButton({ compact = false }: { compact?: boolean }) {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (account) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(account.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="group flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 font-mono text-xs text-foreground transition-colors hover:border-primary/60"
        >
          <span className="h-2 w-2 rounded-full bg-teal animate-pulse-ring" />
          {truncate(account.address)}
          {copied ? (
            <Check className="h-3.5 w-3.5 text-teal" />
          ) : (
            <Copy className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
          )}
        </button>
        {!compact && (
          <button
            onClick={() => disconnect()}
            aria-label="Disconnect wallet"
            className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <ConnectModal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.03]">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </button>
      }
    />
  );
}
