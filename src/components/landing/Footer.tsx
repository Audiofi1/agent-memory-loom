import { Logo } from "./Navbar";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

export function Footer() {
  return (
    <div className="px-4 pb-4 md:px-8 md:pb-8">
      <footer className="relative bg-card/40 backdrop-blur-3xl pt-16 pb-8 overflow-hidden border border-border/50 rounded-3xl shadow-2xl shadow-black/40">
        {/* Background glow */}
        <div className="absolute inset-x-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[300px] bg-teal-500/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="mx-auto max-w-7xl px-8 relative z-10">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] mb-16">
          <div className="flex flex-col justify-between">
            <div>
              <Link to="/" className="inline-block mb-6">
                <Logo className="h-7 w-auto" />
              </Link>
              <p className="max-w-sm text-base text-muted-foreground leading-relaxed">
                The permanent, verifiable memory layer for autonomous AI agents — built on Walrus & Sui.
              </p>
            </div>
          </div>
          
          <FooterCol
            title="Developers"
            items={[
              { label: "Documentation", href: "https://docs.wal.app/" },
              { label: "Getting Started", href: "https://docs.wal.app/docs/getting-started" },
              { label: "TypeScript SDK", href: "https://docs.wal.app/docs/typescript-sdk/sdks" },
              { label: "GitHub", href: "https://github.com/narwhal-memory" },
            ]}
          />
          <FooterCol
            title="Ecosystem"
            items={[
              { label: "Walrus Protocol", href: "https://walrus.xyz/" },
              { label: "Sui Network", href: "https://sui.io/" },
              { label: "Slush Wallet", href: "https://slush.app/" },
              { label: "Sui Overflow", href: "https://sui.io/overflow" },
            ]}
          />
        </div>

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row text-sm text-muted-foreground/80 border-t border-border/40 pt-8 mt-8">
          <p>© {new Date().getFullYear()} Narwhal Memory. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs uppercase tracking-widest text-teal-500/80">Memory that never forgets</span>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}

type Item = { label: string; href: string };

function FooterCol({ title, items }: { title: string; items: Item[] }) {
  return (
    <div>
      <h4 className="mb-6 text-sm font-light uppercase tracking-widest text-foreground">{title}</h4>
      <ul className="space-y-4">
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 text-base text-muted-foreground transition-all hover:text-foreground hover:translate-x-1"
            >
              {it.label}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-teal-400" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
