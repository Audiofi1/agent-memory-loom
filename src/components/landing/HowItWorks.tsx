import { Reveal } from "./Reveal";
import { ArrowDown } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Connect Your Agent",
    description: "Integrate Narwhal into your existing AI agent's logic using our lightweight SDK. It takes less than 3 lines of code to start recording memories.",
  },
  {
    number: "02",
    title: "Immutable Storage",
    description: "Every decision, context window, and action is hashed and stored perpetually on the Sui blockchain, creating a verifiable audit trail.",
  },
  {
    number: "03",
    title: "Continuous Learning",
    description: "Agents query their past interactions from the decentralized memory bank, allowing them to recall context across sessions and build true long-term memory.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-24 overflow-hidden border-y border-border/40 bg-background/30">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <Reveal>
            <p className="text-sm font-light uppercase tracking-[0.25em] text-teal">The Pipeline</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 text-balance text-4xl font-thin leading-tight sm:text-5xl md:text-6xl">
              How Narwhal works
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground font-light leading-relaxed">
              A frictionless path from agent thought to verifiable, immutable memory on the blockchain.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
          
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.15}>
              <div className="relative group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-background border border-border/50 flex items-center justify-center text-3xl font-light text-teal mb-8 shadow-xl shadow-teal-500/5 group-hover:scale-110 group-hover:border-teal-500/30 transition-all duration-500 relative z-10">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-light mb-4">{step.title}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-8">
                    <ArrowDown className="text-border h-8 w-8" />
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
