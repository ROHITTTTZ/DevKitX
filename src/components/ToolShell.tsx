import { Link } from "@tanstack/react-router";
import { ChevronRight, Star, PanelLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, type ReactNode } from "react";
import type { Tool } from "@/lib/tools";
import { useFavorites, useRecent, useUsage } from "@/hooks/use-tool-state";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ToolSidebar } from "@/components/ToolSidebar";
import { ToolContentBlock } from "@/components/ToolContentBlock";

interface Props {
  tool: Tool;
  children: ReactNode;
}

export function ToolShell({ tool, children }: Props) {
  const Icon = tool.icon;
  const { isFav, toggle } = useFavorites();
  const { push } = useRecent();
  const { bump } = useUsage();
  const fav = isFav(tool.slug);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    push(tool.slug);
    bump(tool.slug);
  }, [tool.slug, push, bump]);

  useEffect(() => {
    setMobileOpen(false);
  }, [tool.slug]);

  return (
    <div className="mx-auto flex w-full max-w-[1500px] gap-0 px-0 lg:gap-6 lg:px-6">
      <div className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r border-border/60 py-6 pr-4 lg:block">
        <ToolSidebar activeSlug={tool.slug} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] border-r border-border bg-background p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">All tools</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[calc(100%-2.5rem)]">
              <ToolSidebar activeSlug={tool.slug} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <button
            onClick={() => setMobileOpen(true)}
            className="mr-1 inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-foreground transition-colors hover:bg-accent lg:hidden"
            aria-label="Open tools menu"
          >
            <PanelLeft className="h-3.5 w-3.5" />
            Tools
          </button>
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/tools" className="hover:text-foreground transition-colors">Tools</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-foreground">{tool.name}</span>
        </nav>

        <motion.header
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-border bg-surface-elevated text-brand">
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                  {tool.name}
                </h1>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{tool.longDescription}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggle(tool.slug)}
            className="shrink-0"
          >
            <Star className={cn("h-4 w-4", fav && "fill-brand text-brand")} />
            <span className="hidden sm:inline">{fav ? "Saved" : "Save"}</span>
          </Button>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-8"
        >
          {children}
        </motion.div>

        <ToolContentBlock tool={tool} />
      </div>
    </div>
  );
}
