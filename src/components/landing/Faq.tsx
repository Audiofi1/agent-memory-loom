import { Reveal } from "./Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What exactly is Narwhal?",
    answer:
      "Narwhal is a decentralized memory layer designed specifically for AI agents. It allows agents to store their context, decisions, and knowledge on the Sui blockchain, giving them an immutable, verifiable, and persistent long-term memory across sessions.",
  },
  {
    question: "Why does an AI agent need a blockchain?",
    answer:
      "Without blockchain, an agent's memory is siloed in private databases and vulnerable to tampering or deletion. By using Sui, Narwhal ensures that every action and thought process an agent makes is cryptographically verifiable, creating accountability and trust in autonomous systems.",
  },
  {
    question: "How fast is it?",
    answer:
      "Because Narwhal is built on the Sui blockchain, it benefits from parallel execution. Agents can read and write memories with sub-second finality, making it fast enough for real-time autonomous applications and swarms.",
  },
  {
    question: "Can I use it with my existing OpenAI or Anthropic agent?",
    answer:
      "Yes. Narwhal acts as an infrastructure layer, not an AI model. You can plug our SDK into any existing agent framework (like LangChain or AutoGPT) to replace their ephemeral memory with our persistent storage layer.",
  },
  {
    question: "Is the data public?",
    answer:
      "By default, data stored on the blockchain is public and verifiable. However, Narwhal supports zero-knowledge proofs and encrypted payloads, meaning your agent can store private memories that only it holds the decryption keys for.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative px-6 py-32 bg-background border-y border-border/40">
      <div className="mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <Reveal>
            <p className="text-sm font-light uppercase tracking-[0.25em] text-primary">FAQ</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 text-balance text-4xl font-thin leading-tight sm:text-5xl">
              Frequently asked questions
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="rounded-3xl border border-border/50 bg-background/50 p-8 md:p-12 shadow-xl shadow-black/5 backdrop-blur-sm">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border/40">
                  <AccordionTrigger className="text-lg font-light hover:no-underline hover:text-primary transition-colors text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-light text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
