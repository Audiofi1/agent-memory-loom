import { Link } from "@tanstack/react-router";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletButton } from "./WalletButton";
import penguinHero from "@/assets/penguin-hero.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-secondary/60 ring-1 ring-border">
        <img
          src={penguinHero}
          alt=""
          width={36}
          height={36}
          className="h-8 w-8 scale-125 object-contain object-top"
        />
      </span>
      <span className="text-xl font-extrabold tracking-tight">narwhal</span>
    </span>
  );
}

export function Navbar() {
  const account = useCurrentAccount();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="text-foreground">
          <Logo />
        </Link>

        <div className="flex items-center gap-3">
          {account && (
            <Link
              to="/dashboard"
              className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/60 sm:block"
            >
              Dashboard
            </Link>
          )}
          <WalletButton compact={!!account} redirectOnConnect />
        </div>
      </div>
    </header>
  );
}
