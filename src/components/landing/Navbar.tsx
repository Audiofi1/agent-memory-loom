import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletButton } from "./WalletButton";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import penguinHero from "@/assets/penguin-hero.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-secondary/60 ring-1 ring-border">
        <img
          src={penguinHero}
          alt=""
          width={36}
          height={36}
          className="h-8 w-8 scale-125 object-contain object-top"
        />
      </span>
      <span className="text-xl font-extrabold tracking-tight">narwhal</span>
    </span>
  );
}

export function Navbar() {
  const account = useCurrentAccount();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initialize
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // Sticky track stays full-width and fixed; only the inner bar morphs.
    <header className="sticky top-0 z-50 w-full">
      {/*
        The morphing bar. We animate ONLY interpolatable, mostly-composited
        properties (max-width between two real lengths, margin-top, border-radius,
        background, shadow, border, padding) — never `width` against a
        translate-centered element, and never `transition-all`. Centering is done
        with `mx-auto` so there is no per-frame translate recompute. 500ms with a
        settle easing reads smooth and intentional.
      */}
      <div
        className={cn(
          "mx-auto flex items-center justify-between backdrop-blur-xl transform-gpu",
          "transition-[max-width,margin-top,border-radius,background-color,box-shadow,border-color,padding]",
          "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[max-width] motion-reduce:transition-none",
          isScrolled
            ? "mt-3 max-w-4xl rounded-full border border-border/40 bg-background/80 px-4 py-2 shadow-lg shadow-black/10"
            : "mt-0 max-w-7xl rounded-none border-x-0 border-t-0 border-b border-border/40 bg-background/50 px-6 py-3.5 shadow-none",
        )}
      >
        <div className="flex w-full items-center justify-between">
          <Link to="/" className="text-foreground">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#about"
              className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#features"
              className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#technology"
              className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              Technology
            </a>
          </div>

          <div className="flex items-center gap-3">
            {account && (
              <Link
                to="/dashboard"
                className="hidden rounded-full border border-border px-4 py-2 text-sm font-light text-foreground transition-colors hover:border-primary/60 sm:block"
              >
                Dashboard
              </Link>
            )}
            <ThemeToggle className="hidden sm:inline-flex" />
            <WalletButton compact={!!account} redirectOnConnect />

            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-3xl border-l border-border/40 p-6 flex flex-col"
              >
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <div className="mt-8 flex flex-col gap-6">
                  <Logo />
                  <div className="h-px w-full bg-border/40 my-4" />
                  <div className="flex flex-col gap-6">
                    <a
                      href="#about"
                      className="text-lg font-light text-muted-foreground hover:text-foreground transition-colors"
                    >
                      About
                    </a>
                    <a
                      href="#features"
                      className="text-lg font-light text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Features
                    </a>
                    <a
                      href="#technology"
                      className="text-lg font-light text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Technology
                    </a>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-light text-muted-foreground">Theme</span>
                      <ThemeToggle />
                    </div>

                    {account && (
                      <Link
                        to="/dashboard"
                        className="text-lg font-light text-primary hover:text-primary/80 transition-colors mt-4"
                      >
                        Go to Dashboard →
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
