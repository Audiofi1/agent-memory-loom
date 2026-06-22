import { Link } from "@tanstack/react-router";
import { WalletButton } from "./WalletButton";
import { ArrowUpRight } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path
          d="M9 6c0 7 1 12 4 19 .8 1.8 3.2 1.8 4 0 3-7 4-12 4-19"
          stroke="url(#tg)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="11" cy="6" r="2.4" fill="url(#tg)" />
        <circle cx="21" cy="6" r="2.4" fill="url(#tg)" />
        <defs>
          <linearGradient id="tg" x1="9" y1="6" x2="23" y2="27" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7aa2ff" />
            <stop offset="1" stopColor="#27e0c0" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-xl font-extrabold tracking-tight">tusk</span>
    </span>
  );
}

const links = [
  { label: "Platform", href: "/#platform" },
  { label: "Use cases", href: "/#use-cases" },
  { label: "Stack", href: "/#stack" },
];

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-foreground">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://docs.wal.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/60 sm:block"
          >
            Dashboard
          </Link>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
