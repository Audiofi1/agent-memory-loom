import { ArrowUpRight, Database, Boxes, KeyRound, Globe } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

const stack = [
  { icon: Database, name: "Walrus", desc: "Decentralized storage. Every memory snapshot is a permanent, content-addressed blob." },
  { icon: Boxes, name: "Pools", desc: "Memory indexing & sharing — organizes, queries, and shares agent memory at scale." },
  { icon: KeyRound, name: "Seal", desc: "Encrypts private fields client-side and releases keys only to authorized readers." },
  { icon: Globe, name: "Sui", desc: "Mints permanent Agent IDs and anchors blob hashes on-chain for tamper-proof verification." },
];

export function SuiStack() {
  return (
    <section id="technology" className="relative px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <Reveal>
              <p className="text-sm font-light uppercase tracking-[0.25em] text-primary">Part of the Sui Stack</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 text-balance text-4xl font-thin leading-tight sm:text-6xl">
                Built on trust-minimized infrastructure
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-md text-lg text-muted-foreground">
                Narwhal stitches the Walrus stack together — storage, sharing, encryption, and on-chain proof — so the
                entire product, front to back, lives on infrastructure no single company controls.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <a
                href="https://sui.io/"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-light transition-colors hover:border-primary/60"
              >
                Explore on Sui <ArrowUpRight className="h-4 w-4" />
              </a>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stack.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.08}>
                <div className="hover-lift group h-full rounded-2xl border border-border bg-card p-6">
                  <s.icon className="h-7 w-7 text-teal" strokeWidth={1.5} />
                  <h3 className="mt-4 font-mono text-lg font-light">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-light">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
