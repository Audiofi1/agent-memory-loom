import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_STORAGE_KEY = "narwhal-theme";
const THEME_TRANSITION_MS = 250;

/**
 * Inline script injected before hydration so the correct theme class is on
 * <html> before first paint — eliminates the light/dark flash (FOUC).
 */
export const themeInitScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}var d=document.documentElement;d.classList.toggle('dark',t==='dark');d.style.colorScheme=t;}catch(e){}})();`;

function readInitialTheme(): Theme {
  if (typeof document !== "undefined") {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  }
  return "dark";
}

function applyThemeToDom(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage may be unavailable — non-fatal.
  }
}

function beginThemeTransition() {
  document.documentElement.classList.add("theme-transition");
}

function endThemeTransition() {
  window.setTimeout(() => {
    document.documentElement.classList.remove("theme-transition");
  }, THEME_TRANSITION_MS);
}

function runThemeTransition(commit: () => void) {
  if (typeof document === "undefined") {
    commit();
    return;
  }

  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => { finished: Promise<void> };
  };

  // If view transitions are supported, use them exclusively
  if (doc.startViewTransition) {
    doc.startViewTransition(commit);
    return;
  }

  // Fallback for browsers without View Transitions
  beginThemeTransition();
  commit();
  endThemeTransition();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);
  const isMount = useRef(true);

  useEffect(() => {
    if (isMount.current) {
      isMount.current = false;
      applyThemeToDom(theme);
      return;
    }

    runThemeTransition(() => applyThemeToDom(theme));
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState((prev) => (prev === next ? prev : next));
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
