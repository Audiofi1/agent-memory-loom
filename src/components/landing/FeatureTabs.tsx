import { useState } from "react";
import { motion } from "motion/react";
import { Infinity as InfinityIcon, Share2, ShieldCheck, Lock } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

const tabs = [
  {
    key: "Availability",
    icon: InfinityIcon,
    title: "Always available",
    body: "Snapshots are written as content-addressed blobs on Walrus — they outlive the app that created them, load fast, and never silently disappear.",
  },
  {
    key: "Shareability",
    icon: Share2,
    title: "Shared at scale",
    body: "Memory pools let one agent read another's relevant memory under clear access policies, unlocking real multi-agent coordination.",
  },
  {
    key: "Verifiability",
    icon: ShieldCheck,
    title: "Verifiable by anyone",
    body: "Every snapshot gets a verifiable blob ID anchored on Sui, so any human or agent can prove a memory hasn't been tampered with.",
  },
  {
    key: "Privacy",
    icon: Lock,
    title: "Private by design",
    body: "Seal encrypts any field flagged private before it's stored. You control exactly which agents and humans can decrypt it.",
  },
];

export function FeatureTabs() {
  const [active, setActive] = useState(0);
  const Tab = tabs[active];
  return (
    <section id="features" className="relative px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <Reveal>
            <p className="text-sm font-light uppercase tracking-[0.25em] text-primary">Power to the builder</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 text-balance text-4xl font-light leading-tight sm:text-6xl">
              The memory layer no single company owns
            </h2>
          </Reveal>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {tabs.map((t, i) => (
            <button
              key={t.key}
              onClick={() => setActive(i)}
              className={`rounded-full border px-5 py-2 text-sm font-light transition-colors ${
                i === active
                  ? "border-transparent bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.key}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <motion.div
            key={Tab.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-10 lg:col-span-2"
          >
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
            <Tab.icon className="h-10 w-10 text-teal" strokeWidth={1.5} />
            <h3 className="mt-8 text-3xl font-light sm:text-4xl">{Tab.title}</h3>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground font-light">{Tab.body}</p>
          </motion.div>

          <div className="flex flex-col gap-5">
            {tabs.map((t, i) => (
              <button
                key={t.key}
                onClick={() => setActive(i)}
                className={`hover-lift flex-1 rounded-3xl border p-6 text-left transition-colors ${
                  i === active ? "border-primary/60 bg-card" : "border-border bg-card/50"
                }`}
              >
                <t.icon className="h-6 w-6 text-teal" strokeWidth={1.5} />
                <h4 className="mt-3 text-lg font-light">{t.title}</h4>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
