import { useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  useCurrentAccount,
  useDisconnectWallet,
  useConnectWallet,
  useWallets,
} from "@mysten/dapp-kit";
import type { WalletWithRequiredFeatures } from "@mysten/wallet-standard";
import { Wallet, LogOut, Copy, Check, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/** Only surface Sui-native wallets — never Phantom / EVM injectors. */
function useSuiWallets() {
  const wallets = useWallets();
  return wallets.filter((w) => !/phantom|metamask|coinbase/i.test(w.name));
}

function WalletDialog({
  open,
  onOpenChange,
  onConnected,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConnected?: () => void;
}) {
  const wallets = useSuiWallets();
  const { mutate: connect, isPending } = useConnectWallet();

  function handleConnect(wallet: WalletWithRequiredFeatures) {
    connect(
      { wallet },
      {
        onSuccess: () => {
          onOpenChange(false);
          onConnected?.();
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-sm border-border">
        <DialogHeader>
          <DialogTitle className="text-xl">Connect a Sui wallet</DialogTitle>
          <DialogDescription>
            Your wallet is your agents' on-chain identity on Sui testnet.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-2">
          {wallets.length === 0 && (
            <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
              No Sui wallet detected. Install the{" "}
              <a
                href="https://slush.app/"
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline"
              >
                Slush wallet
              </a>{" "}
              or pick one below.
            </div>
          )}
          {wallets.map((w) => (
            <button
              key={w.name}
              disabled={isPending}
              onClick={() => handleConnect(w)}
              className="group flex w-full items-center gap-3 rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-left transition-colors hover:border-primary/60 hover:bg-secondary/70 disabled:opacity-50"
            >
              {w.icon ? (
                <img src={w.icon} alt="" className="h-8 w-8 rounded-lg" />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                  <Wallet className="h-4 w-4 text-teal" />
                </span>
              )}
              <span className="flex-1 font-medium">{w.name}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** The pill shown in nav/topbar: connect, or address + disconnect when connected. */
export function WalletButton({
  compact = false,
  redirectOnConnect = false,
}: {
  compact?: boolean;
  redirectOnConnect?: boolean;
}) {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const navigate = useNavigate();
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
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </button>
      <WalletDialog
        open={open}
        onOpenChange={setOpen}
        onConnected={() => redirectOnConnect && navigate({ to: "/dashboard" })}
      />
    </>
  );
}

/** Big hero CTA: enters the dashboard if connected, otherwise opens the wallet modal. */
export function LaunchCta({
  children = "Launch app",
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  const account = useCurrentAccount();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => (account ? navigate({ to: "/dashboard" }) : setOpen(true))}
        className={className}
      >
        {children}
      </button>
      <WalletDialog
        open={open}
        onOpenChange={setOpen}
        onConnected={() => navigate({ to: "/dashboard" })}
      />
    </>
  );
}

import type { ReactNode } from "react";
