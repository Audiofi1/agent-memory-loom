import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { IntroBand } from "@/components/landing/IntroBand";
import { FeatureTabs } from "@/components/landing/FeatureTabs";
import { TextMarquee } from "@/components/landing/TextMarquee";
import { SuiStack } from "@/components/landing/SuiStack";
import { CtaSection } from "@/components/landing/CtaSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";


import { HeroSection } from "@/components/blocks/hero-section-1";

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
    <div className="relative overflow-x-clip bg-background text-foreground min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <HeroSection />
      <IntroBand />
      <HowItWorks />
      <FeatureTabs />
      <TextMarquee />
      <SuiStack />
      <Faq />
      <CtaSection />
      <Footer />
    </div>
  );
}
