import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Marquee } from "@/components/ui/marquee";
import { LaunchCta } from "@/components/landing/WalletButton";
import ShaderBackground from "@/components/ui/shader-background";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(16px)",
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0,
        duration: 1.5,
      },
    },
  } as const,
};

export function HeroSection() {
  const { theme } = useTheme();

  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute inset-0 z-0 min-h-[120vh] w-full"
      >
        <ShaderBackground theme={theme} className="min-h-[120vh]" />
        <div
          className={cn(
            "absolute inset-0 bg-background/45 transition-opacity duration-500 ease-in-out",
            theme === "dark" ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-36 bg-linear-to-b from-sky-200/90 to-transparent transition-opacity duration-500 ease-in-out",
            theme === "light" ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-sky-200/90 to-transparent transition-opacity duration-500 ease-in-out",
            theme === "light" ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent transition-opacity duration-500 ease-in-out",
            theme === "dark" ? "opacity-100" : "opacity-0",
          )}
        />
      </motion.div>

      <section className="relative z-10">
        <div className="relative pt-24 md:pt-36">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              <AnimatedGroup variants={transitionVariants}>
                <Link
                  to="/"
                  className="inline-flex mx-auto items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur-sm transition-all hover:bg-card hover:text-foreground group"
                >
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
                    </span>
                    Update
                  </span>
                  <span className="mx-1 hidden h-4 w-px bg-border sm:block" />
                  <span className="max-w-[180px] truncate sm:max-w-none">
                    Memory infrastructure for the agent economy
                  </span>
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <h1 className="mx-auto mt-8 max-w-4xl text-balance text-6xl font-thin md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                  Memory that never forgets
                </h1>
                <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                  For too long, agents have worked blind, alone, and unaccountable. Give any agent a
                  permanent, tamper-proof place to store what it knows, what it decided, and why.
                </p>
              </AnimatedGroup>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
              >
                <div className="rounded-[14px] border border-border bg-card/60 p-0.5">
                  <LaunchCta className="hover-lift flex items-center gap-2 rounded-xl bg-foreground px-8 py-4 text-base font-light text-background transition-all">
                    Start building
                    <ArrowUpRight className="h-4 w-4 text-teal" />
                  </LaunchCta>
                </div>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-xl border-border bg-card/60 px-8 backdrop-blur-md"
                >
                  <a href="https://docs.wal.app/" target="_blank" rel="noreferrer">
                    <span className="text-nowrap text-base font-light">Read the docs</span>
                  </a>
                </Button>
              </AnimatedGroup>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-16 pt-16 md:pb-32">
        <div className="relative m-auto max-w-5xl px-6">
          <div className="mx-auto mt-4 w-full max-w-6xl md:mt-12">
            <Marquee className="py-4" fade={false} duration={30}>
              {["React", "Next.js", "Tailwind", "TypeScript", "Supabase", "Sui", "Walrus"].map(
                (name) => (
                  <span
                    key={name}
                    className="mx-8 text-2xl font-medium text-muted-foreground"
                  >
                    {name}
                  </span>
                ),
              )}
            </Marquee>
          </div>
        </div>
      </section>
    </main>
  );
}
