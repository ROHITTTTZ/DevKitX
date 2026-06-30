import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const s = window.localStorage.getItem("ss-theme");
    if (s === "dark" || s === "light") return s;
  } catch {
    /* ignore */
  }
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage synchronously on the client so we never
  // momentarily render with the wrong theme and overwrite the stored value.
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);

  // If we mounted with SSR's default (light) but the stored value is dark,
  // sync after hydration. Runs once; does NOT write to localStorage.
  useEffect(() => {
    const stored = readStoredTheme();
    setThemeState((curr) => (curr === stored ? curr : stored));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem("ss-theme", t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setThemeState((curr) => {
      const next = curr === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("ss-theme", next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ theme, toggle, setTheme }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
