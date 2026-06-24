import { Reveal } from "./Reveal";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Developer",
    price: "Free",
    description: "Perfect for testing and building your first agent.",
    features: [
      "Up to 10,000 memory queries/month",
      "Standard latency API",
      "7-day memory retention",
      "Community support",
    ],
    cta: "Start for free",
    popular: false,
  },
  {
    name: "Pro Agent",
    price: "$49",
    period: "/month",
    description: "For autonomous agents running in production.",
    features: [
      "Unlimited memory queries",
      "Sub-10ms read/write latency",
      "Perpetual immutable storage on Sui",
      "Advanced context search",
      "Priority email support",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Dedicated infrastructure for multi-agent swarms.",
    features: [
      "Dedicated Sui RPC nodes",
      "Custom SLA guarantees",
      "On-premise deployment options",
      "Dedicated solutions engineer",
      "24/7 phone support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative px-6 py-32 overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-violet-500/5 blur-[150px] rounded-[100%] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-24">
          <Reveal>
            <p className="text-sm font-light uppercase tracking-[0.25em] text-primary">Pricing</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 text-balance text-4xl font-thin leading-tight sm:text-5xl md:text-6xl">
              Predictable costs for infinite memory
            </h2>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1}>
              <div 
                className={`relative flex flex-col h-full rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] ${
                  plan.popular 
                    ? "bg-foreground/5 border-2 border-primary/20 shadow-2xl shadow-primary/10" 
                    : "bg-background border border-border/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium tracking-widest uppercase">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-light mb-2">{plan.name}</h3>
                <p className="text-muted-foreground font-light text-sm mb-6 h-10">{plan.description}</p>
                
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-thin tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground font-light">{plan.period}</span>}
                </div>
                
                <Button 
                  variant={plan.popular ? "default" : "outline"} 
                  className={`w-full rounded-full py-6 text-base font-light mb-8 ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                >
                  {plan.cta}
                </Button>
                
                <div className="space-y-4 mt-auto">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3 text-sm font-light">
                      <div className="mt-0.5 rounded-full bg-primary/20 p-0.5">
                        <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
