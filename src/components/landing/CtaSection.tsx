import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { LaunchCta } from "@/components/landing/WalletButton";

export function CtaSection() {
  return (
    <section className="relative px-6 py-32">
      <div className="aurora-glow pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="text-balance text-5xl font-thin leading-[0.95] tracking-tight sm:text-7xl">
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
            <LaunchCta className="group flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-light text-background transition-transform hover:scale-[1.03]">
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
