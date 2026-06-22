import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Infinity as InfinityIcon,
  Share2,
  ShieldCheck,
  Lock,
  Database,
  KeyRound,
  Boxes,
  Globe,
} from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal, RevealText } from "@/components/landing/Reveal";
import { LaunchCta } from "@/components/landing/WalletButton";
import penguinHero from "@/assets/penguin-hero.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Narwhal — Verifiable memory for AI agents" },
      {
        name: "description",
        content:
          "Narwhal is the permanent, verifiable memory layer for autonomous AI agents — built on Walrus and Sui. Provable, shareable, accountable.",
      },
      { property: "og:title", content: "Narwhal — Verifiable memory for AI agents" },
      {
        property: "og:description",
        content: "Permanent, tamper-proof, shareable memory for autonomous AI agents. Built on Walrus & Sui.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative overflow-x-clip bg-background text-foreground">
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <IntroBand />
      <FeatureTabs />
      <Marquee />
      <SuiStack />
      <CtaSection />
      <Footer />
    </div>
  );
}

/* ---------------- ANNOUNCEMENT BAR ---------------- */
function AnnouncementBar() {
  return (
    <div className="relative z-[60] w-full bg-gradient-to-r from-primary via-violet to-teal py-2 text-center text-sm font-medium text-background">
      Introducing Narwhal Memory: portable, verifiable memory for AI agents
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-7rem)] flex-col items-center justify-end overflow-hidden px-6 pb-0 pt-12 text-center">
      {/* aurora glow behind the mascot */}
      <div className="aurora-glow pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[80vh]" />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.55, scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="pointer-events-none absolute bottom-[6vh] left-1/2 z-0 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-primary/40 blur-[120px]"
      />

      {/* eyebrow + headline */}
      <div className="relative z-20 mx-auto max-w-4xl">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
          Memory infrastructure for the agent economy
        </motion.span>

        <h1 className="text-balance text-5xl font-extrabold leading-[0.9] tracking-tight sm:text-7xl md:text-8xl">
          <RevealText text="Memory that" className="block" />
          <motion.span
            className="block text-gradient"
            initial={{ opacity: 0, filter: "blur(16px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
          >
            never forgets
          </motion.span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <LaunchCta className="group flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-base font-semibold text-background transition-transform hover:scale-[1.03]">
            Start building
            <ArrowUpRight className="h-4 w-4" />
          </LaunchCta>
          <a
            href="https://docs.wal.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-primary/60"
          >
            Read the docs
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>

      {/* the 3D penguin mascot, rising from the bottom */}
      <motion.img
        src={penguinHero}
        alt="Narwhal — the verifiable memory mascot"
        width={1024}
        height={1024}
        initial={{ opacity: 0, y: 80, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="animate-float relative z-10 mt-2 w-[clamp(260px,42vw,560px)] select-none drop-shadow-[0_40px_120px_rgba(80,110,255,0.45)]"
      />

      {/* bottom rounded label panel, walrus-style */}
      <div className="relative z-20 -mt-6 w-full max-w-4xl rounded-t-[2.5rem] border border-b-0 border-border bg-card/60 px-6 py-5 backdrop-blur">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground"
        >
          Your verifiable memory layer
        </motion.p>
      </div>
    </section>
  );
}

/* ---------------- INTRO BAND ---------------- */
function IntroBand() {
  return (
    <section className="relative px-6 py-28">
      <div className="aurora-glow pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Your verifiable memory layer
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mx-auto mt-8 max-w-4xl text-balance text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
            No forgetting.
            <br />
            No silos.
            <br />
            No black boxes.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">
            For too long, agents have worked blind, alone, and unaccountable.{" "}
            <span className="text-foreground">Narwhal removes those limits.</span> Give any agent a permanent,
            tamper-proof place to store what it knows, what it decided, and why.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <a
            href="https://docs.wal.app/docs/getting-started"
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-violet/90 px-7 py-3.5 text-base font-semibold text-background transition-transform hover:scale-[1.03]"
          >
            Read the docs <ArrowUpRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- FEATURE TABS ---------------- */
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

function FeatureTabs() {
  const [active, setActive] = useState(0);
  const Tab = tabs[active];
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Power to the builder</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 text-balance text-4xl font-bold leading-tight sm:text-6xl">
              The memory layer no single company owns
            </h2>
          </Reveal>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {tabs.map((t, i) => (
            <button
              key={t.key}
              onClick={() => setActive(i)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
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
            <h3 className="mt-8 text-3xl font-bold sm:text-4xl">{Tab.title}</h3>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{Tab.body}</p>
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
                <h4 className="mt-3 text-lg font-bold">{t.title}</h4>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- MARQUEE ---------------- */
function Marquee() {
  const word = "THE FUTURE RUNS ON NARWHAL";
  const items = Array.from({ length: 6 });
  return (
    <section className="relative overflow-hidden border-y border-border py-10">
      <div className="flex w-max animate-marquee gap-8">
        {items.concat(items).map((_, i) => (
          <span key={i} className="flex items-center gap-8 text-3xl font-extrabold tracking-tight sm:text-5xl">
            <span className={i % 2 ? "text-gradient" : "text-muted-foreground"}>{word}</span>
            <span className="text-teal">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- SUI STACK ---------------- */
const stack = [
  { icon: Database, name: "Walrus", desc: "Decentralized storage. Every memory snapshot is a permanent, content-addressed blob." },
  { icon: Boxes, name: "Pools", desc: "Memory indexing & sharing — organizes, queries, and shares agent memory at scale." },
  { icon: KeyRound, name: "Seal", desc: "Encrypts private fields client-side and releases keys only to authorized readers." },
  { icon: Globe, name: "Sui", desc: "Mints permanent Agent IDs and anchors blob hashes on-chain for tamper-proof verification." },
];

function SuiStack() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Part of the Sui Stack</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 text-balance text-4xl font-bold leading-tight sm:text-6xl">
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
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/60"
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
                  <h3 className="mt-4 font-mono text-lg font-bold">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CtaSection() {
  return (
    <section className="relative px-6 py-32">
      <div className="aurora-glow pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="text-balance text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
            Give your agents <span className="text-gradient">memory that matters</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Connect your Sui wallet, register an agent, and write its first verifiable memory — anchored on-chain in
            minutes.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <LaunchCta className="group flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-semibold text-background transition-transform hover:scale-[1.03]">
              Connect wallet
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </LaunchCta>
            <a
              href="https://docs.wal.app/docs/getting-started"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-border px-8 py-4 text-base font-semibold transition-colors hover:border-primary/60"
            >
              Read the docs <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
