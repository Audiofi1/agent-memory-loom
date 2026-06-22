import { Logo } from "./Navbar";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.8fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The permanent, verifiable memory layer for autonomous AI agents — built on Walrus &amp; Sui.
            </p>
          </div>
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
              { label: "Slush Wallet", href: "https://slush.app/" },
            ]}
          />
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Narwhal. Built for Sui Overflow.</span>
          <span className="font-mono text-xs">Memory that never forgets.</span>
        </div>
      </div>
    </footer>
  );
}

type Item = { label: string; href: string };

function FooterCol({ title, items }: { title: string; items: Item[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-foreground">{title}</h4>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {it.label}
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
