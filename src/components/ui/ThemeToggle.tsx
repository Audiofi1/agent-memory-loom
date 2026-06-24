import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

/**
 * Accessible light/dark switch. Renders a neutral icon until mounted so SSR
 * (which always renders the `dark` default) never mismatches client hydration.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? theme === "dark" : true;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        "group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary/50 text-foreground outline-none transition-[colors,transform,border-color] duration-500 ease-in-out hover:border-primary/60 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all duration-500",
          isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
          "absolute",
        )}
      />
      <Moon
        className={cn(
          "h-4 w-4 transition-all duration-500",
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0",
          "absolute",
        )}
      />
    </button>
  );
}
