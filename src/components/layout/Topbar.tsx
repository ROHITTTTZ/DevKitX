import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Search, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { CommandSearch } from "./CommandSearch";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { FeedbackDialog } from "@/components/FeedbackDialog";

export function Topbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/tools", label: "Tools" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 glass">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Logo size={26} />
            <span className="text-[15px] font-semibold tracking-tight">DevKitX</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navLinks.map((l) => {
              const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="hidden md:flex items-center gap-2 h-9 w-64 rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/70"
            >
              <Search className="h-4 w-4" />
              <span>Search tools…</span>
              <kbd className="ml-auto rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(true)}
              className="md:hidden"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <FeedbackDialog />
            <Button
              size="icon"
              variant="ghost"
              onClick={toggle}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>
      <CommandSearch open={open} onOpenChange={setOpen} />
    </>
  );
}
