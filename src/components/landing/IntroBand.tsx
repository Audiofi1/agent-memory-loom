import { ArrowUpRight, Brain, Network, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { motion } from "motion/react";

const features = [
  {
    icon: Brain,
    title: "No forgetting.",
    description: "Permanent memory state stored as content-addressed blobs. Once it's known, it's known forever.",
    color: "text-teal-400",
    glow: "bg-teal-500/20"
  },
  {
    icon: Network,
    title: "No silos.",
    description: "Share context effortlessly between agents. Build memory pools that coordinate at planetary scale.",
    color: "text-violet-400",
    glow: "bg-violet-500/20"
  },
  {
    icon: ShieldCheck,
    title: "No black boxes.",
    description: "Every decision is verifiable. Agent memories are securely anchored on-chain with cryptographic proof.",
    color: "text-indigo-400",
    glow: "bg-indigo-500/20"
  }
];

export function IntroBand() {
  return (
    <section id="about" className="relative px-6 py-32 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-violet-500/5 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <Reveal>
            <p className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-400 border border-teal-500/30 rounded-full bg-teal-500/5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              The Intelligence Layer
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mx-auto max-w-4xl text-balance text-5xl font-thin leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Unleash your agents.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground/90 leading-relaxed font-light">
              For too long, AI agents have worked blind, alone, and unaccountable. 
              <strong className="text-foreground font-medium"> Narwhal removes those limits. </strong> 
              Give any agent a permanent, tamper-proof place to store what it knows, what it decided, and why.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={0.3 + i * 0.1}>
              <div className="group relative h-full rounded-3xl border border-border/50 bg-card/20 backdrop-blur-md p-8 overflow-hidden transition-all duration-500 hover:bg-card/40 hover:border-border">
                {/* Subtle hover glow inside card */}
                <div className={`absolute -right-20 -top-20 w-48 h-48 ${feature.glow} blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                
                <div className="relative z-10">
                  <div className="mb-6 inline-flex p-3 rounded-2xl bg-background border border-border/50 shadow-xl">
                    <feature.icon className={`h-6 w-6 ${feature.color}`} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-light tracking-tight mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">{feature.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.6}>
          <div className="mt-20 text-center">
            <a
              href="https://docs.wal.app/docs/getting-started"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-light text-background transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/20"
            >
              Start building <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
