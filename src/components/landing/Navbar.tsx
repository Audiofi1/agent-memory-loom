import { Link } from "@tanstack/react-router";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletButton } from "./WalletButton";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
        {/* narwhal tusk */}
        <path
          d="M5 25c6-2 12-6 17-12 1.6-1.9 4-4.4 6.5-6"
          stroke="url(#ng)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M6.5 23.2c5-1.6 10-5 14.2-9.8"
          stroke="url(#ng)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="7" cy="24" r="2.6" fill="url(#ng)" />
        <defs>
          <linearGradient id="ng" x1="5" y1="25" x2="29" y2="7" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7aa2ff" />
            <stop offset="1" stopColor="#27e0c0" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-xl font-extrabold tracking-tight">narwhal</span>
    </span>
  );
}

export function Navbar() {
  const account = useCurrentAccount();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
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
