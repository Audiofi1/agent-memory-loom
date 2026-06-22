import { Link } from "@tanstack/react-router";
import { Logo } from "./Navbar";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The permanent, verifiable memory backbone for autonomous AI agents — built on Walrus & Sui.
            </p>
          </div>
          <FooterCol
            title="Product"
            items={[
              { label: "Dashboard", to: "/dashboard" },
              { label: "Platform", href: "/#platform" },
              { label: "Use cases", href: "/#use-cases" },
            ]}
          />
          <FooterCol
            title="Build"
            items={[
              { label: "Walrus Docs", href: "https://docs.wal.app/" },
              { label: "Getting started", href: "https://docs.wal.app/docs/getting-started" },
              { label: "TypeScript SDK", href: "https://docs.wal.app/docs/typescript-sdk/sdks" },
            ]}
          />
          <FooterCol
            title="Ecosystem"
            items={[
              { label: "Walrus", href: "https://walrus.xyz/" },
              { label: "Sui", href: "https://sui.io/" },
              { label: "Seal", href: "https://docs.wal.app/" },
            ]}
          />
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Tusk. Built for Sui Overflow.</span>
          <span className="font-mono text-xs">Trust the tusk.</span>
        </div>
      </div>
    </footer>
  );
}

type Item = { label: string; href?: string; to?: string };

function FooterCol({ title, items }: { title: string; items: Item[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-foreground">{title}</h4>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.label}>
            {it.to ? (
              <Link to={it.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {it.label}
              </Link>
            ) : (
              <a
                href={it.href}
                target={it.href?.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {it.label}
                {it.href?.startsWith("http") && <ArrowUpRight className="h-3 w-3" />}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
