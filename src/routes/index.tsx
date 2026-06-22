import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Infinity as InfinityIcon,
  Share2,
  ShieldCheck,
  Lock,
  Bot,
  Search,
  Activity,
  Database,
  KeyRound,
  Boxes,
  Globe,
} from "lucide-react";
import { ThreeScene } from "@/components/three/ThreeScene";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal, RevealText } from "@/components/landing/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tusk — Verifiable memory for AI agents" },
      {
        name: "description",
        content:
          "Tusk is the permanent, verifiable memory backbone for autonomous AI agents — built on Walrus and Sui. Provable, shareable, accountable.",
      },
      { property: "og:title", content: "Tusk — Verifiable memory for AI agents" },
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
      <Navbar />
      <Hero />
      <IntroBand />
      <Platform />
      <UseCases />
      <Stack />
      <Marquee />
      <CtaSection />
      <Footer />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
      <ThreeScene className="pointer-events-none absolute inset-0 z-0" />
      <div className="aurora-glow pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[70vh]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/40 via-transparent to-background" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.a
          href="/dashboard"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-teal" />
          Introducing Tusk: portable memory for AI agents
          <ArrowRight className="h-3.5 w-3.5" />
        </motion.a>

        <h1 className="text-balance text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
          <RevealText text="Memory for agents" className="block" />
          <motion.span
            className="block text-muted-foreground"
            initial={{ opacity: 0, filter: "blur(16px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
          >
            that never forgets
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground"
        >
          Tusk is the verifiable memory backbone for autonomous AI agents — built on Walrus. Every decision is{" "}
          <span className="text-foreground">provable</span>, every memory{" "}
          <span className="text-foreground">permanent</span>, every action{" "}
          <span className="text-foreground">accountable</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/dashboard"
            className="group flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-base font-semibold text-background transition-transform hover:scale-[1.03]"
          >
            Launch app
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="https://docs.wal.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-primary/60"
          >
            Read the docs
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted-foreground"
      >
        Your verifiable memory layer
      </motion.div>
    </section>
  );
}

/* ---------------- INTRO BAND ---------------- */
function IntroBand() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            No forgetting. No silos. No black boxes.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-bold leading-tight sm:text-5xl">
            For too long, agents have worked blind, alone, and unaccountable.{" "}
            <span className="text-muted-foreground">Tusk removes those limits.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Give any agent a permanent, tamper-proof place to store what it knows, what it decided, and why — readable by
            other agents under clear rules, and auditable by humans at any time.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- PLATFORM ---------------- */
const features = [
  {
    icon: InfinityIcon,
    title: "Always permanent",
    body: "Snapshots are written as content-addressed blobs on Walrus — they outlive the app that created them and never silently disappear.",
  },
  {
    icon: Share2,
    title: "Shared at scale",
    body: "Memory pools let one agent read another's relevant memory under access policies, unlocking real multi-agent coordination.",
  },
  {
    icon: ShieldCheck,
    title: "Verifiable & fast",
    body: "Every snapshot gets a verifiable blob ID anchored on Sui, so anyone can prove a memory hasn't been tampered with.",
  },
  {
    icon: Lock,
    title: "Private by design",
    body: "Seal encrypts any field flagged private before it's stored. You control exactly which agents and humans can decrypt it.",
  },
];

function Platform() {
  return (
    <section id="platform" className="relative px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Power to the builder</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 text-balance text-4xl font-bold leading-tight sm:text-6xl">
              The memory layer no single company owns
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="hover-lift group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-8">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-40" />
                <f.icon className="h-9 w-9 text-teal" strokeWidth={1.5} />
                <h3 className="mt-6 text-2xl font-bold">{f.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- USE CASES ---------------- */
const useCases = [
  {
    icon: Bot,
    tag: "Trading agents",
    title: "Strategies that remember.",
    body: "Trading bots persist every decision and its reasoning, so performance is explainable and never lost between sessions.",
  },
  {
    icon: Search,
    tag: "Research assistants",
    title: "Shared knowledge, no silos.",
    body: "Research agents publish findings to shared pools, letting other agents build on verified context instead of starting over.",
  },
  {
    icon: Activity,
    tag: "Monitoring systems",
    title: "An audit trail that proves itself.",
    body: "Monitoring agents log what they saw and did — producing a tamper-proof record for compliance, trust, and debugging.",
  },
];

function UseCases() {
  return (
    <section id="use-cases" className="relative px-6 py-28">
      <div className="aurora-glow pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Use cases</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 text-balance text-4xl font-bold leading-tight sm:text-6xl">
                The future runs on Tusk
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {useCases.map((c, i) => (
            <Reveal key={c.tag} delay={i * 0.1}>
              <div className="hover-lift group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-8">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary/60">
                    <c.icon className="h-6 w-6 text-teal" strokeWidth={1.5} />
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {c.tag}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold leading-snug">{c.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{c.body}</p>
                </div>
                <Link
                  to="/dashboard"
                  className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-colors group-hover:text-teal"
                >
                  Try it live <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- STACK ---------------- */
const stack = [
  { icon: Database, name: "Walrus", desc: "Decentralized storage. Every memory snapshot is a permanent, content-addressed blob." },
  { icon: Boxes, name: "MemWal", desc: "Memory indexing & pools — organizes, queries, and shares agent memory at scale." },
  { icon: KeyRound, name: "Seal", desc: "Encrypts private fields client-side and releases keys only to authorized readers." },
  { icon: Globe, name: "Sui", desc: "Mints permanent Agent IDs and anchors blob hashes on-chain for tamper-proof verification." },
];

function Stack() {
  return (
    <section id="stack" className="relative px-6 py-28">
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
                Tusk stitches the Walrus stack together — storage, indexing, encryption, and on-chain proof — so the
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

/* ---------------- MARQUEE ---------------- */
function Marquee() {
  const word = "TRUST THE TUSK";
  const items = Array.from({ length: 8 });
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
            Register an agent, write its first verifiable memory, and watch it anchor on-chain — in under five minutes.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="group flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-semibold text-background transition-transform hover:scale-[1.03]"
            >
              Launch the app
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://docs.wal.app/docs/getting-started"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-border px-8 py-4 text-base font-semibold transition-colors hover:border-primary/60"
            >
              Start building <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
