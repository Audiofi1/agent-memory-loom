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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/AuthProvider";

function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

const SLUSH_WEB_ID = "com.mystenlabs.suiwallet.web";

function useSuiWallets() {
  const wallets = useWallets();
  const sui = wallets.filter((w) => !/phantom|metamask|coinbase|rabby|okx/i.test(w.name));
  const byName = new Map<string, (typeof sui)[number]>();
  for (const w of sui) {
    const existing = byName.get(w.name);
    if (!existing) {
      byName.set(w.name, w);
      continue;
    }
    const existingIsWeb = (existing as { id?: string }).id === SLUSH_WEB_ID;
    const candidateIsWeb = (w as { id?: string }).id === SLUSH_WEB_ID;
    if (existingIsWeb && !candidateIsWeb) byName.set(w.name, w);
  }
  return Array.from(byName.values());
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
        onError: (err) => {
          toast.error("Couldn't connect wallet", {
            description:
              err instanceof Error
                ? err.message
                : "Open your Slush extension and approve the connection.",
          });
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

/** Connect wallet = logged in. Server session seals in the background when possible. */
export function WalletButton({
  compact = false,
  redirectOnConnect = false,
}: {
  compact?: boolean;
  redirectOnConnect?: boolean;
}) {
  const account = useCurrentAccount();
  const { signOut } = useAuth();
  const { mutate: disconnect } = useDisconnectWallet();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleDisconnect() {
    await signOut().catch(() => undefined);
    disconnect();
  }

  if (account) {
    const colorSeed = parseInt(account.address.slice(-4), 16);
    const hues = ["bg-rose-500", "bg-teal-500", "bg-violet-500", "bg-amber-500", "bg-blue-500"];
    const avatarColor = hues[colorSeed % hues.length];

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="group flex items-center gap-2 rounded-full border border-border bg-secondary/60 py-1.5 pl-1.5 pr-4 transition-colors hover:border-primary/60 outline-none">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full ${avatarColor} shadow-inner`}
          >
            <Wallet className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-mono text-xs text-foreground tracking-tight">
            {truncate(account.address)}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 mt-2 rounded-2xl border-border/60 bg-background/95 backdrop-blur-3xl p-2 shadow-2xl"
        >
          <DropdownMenuLabel className="font-light text-muted-foreground text-xs uppercase tracking-widest px-2">
            Connected
          </DropdownMenuLabel>
          <div className="px-2 py-3 flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${avatarColor} shadow-inner`}
            >
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm text-foreground">{truncate(account.address)}</span>
              <span className="text-xs font-light text-teal flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
                Sui Testnet
              </span>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-border/40" />
          <DropdownMenuItem
            className="cursor-pointer font-light gap-2 px-3 py-2.5 rounded-xl hover:bg-secondary/60 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(account.address);
              setCopied(true);
              toast.success("Address copied");
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? (
              <Check className="h-4 w-4 text-teal" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
            {copied ? "Copied" : "Copy address"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer font-light gap-2 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors focus:text-destructive focus:bg-destructive/10"
            onClick={() => void handleDisconnect()}
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
