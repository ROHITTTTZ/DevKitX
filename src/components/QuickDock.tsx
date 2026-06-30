import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import { TOOLS } from "@/lib/tools";
import { useUsage, useFavorites } from "@/hooks/use-tool-state";
import { cn } from "@/lib/utils";

export function QuickDock() {
  const { usage } = useUsage();
  const { favorites } = useFavorites();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hide on tool pages (sidebar already gives quick access)
  if (pathname.startsWith("/tools/")) return null;

  const items = useMemo(() => {
    const counted = TOOLS.map((t) => ({
      tool: t,
      score: (usage[t.slug] ?? 0) + (favorites.includes(t.slug) ? 100 : 0),
    }));
    const used = counted.filter((c) => c.score > 0).sort((a, b) => b.score - a.score);
    const pool = used.length >= 6 ? used : [
      ...used,
      ...counted
        .filter((c) => c.score === 0 && c.tool.popular)
        .map((c) => ({ ...c, score: 0 })),
    ];
    return pool.slice(0, 6).map((c) => c.tool);
  }, [usage, favorites]);

  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 sm:bottom-6">
      <div
        className={cn(
          "pointer-events-auto flex items-center gap-1 rounded-2xl border border-border bg-card/95 p-1.5 shadow-elevated backdrop-blur-md",
        )}
      >
        {items.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.slug}
              to="/tools/$slug"
              params={{ slug: t.slug }}
              title={t.name}
              className="group relative grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-all hover:scale-110 hover:bg-accent hover:text-foreground sm:h-11 sm:w-11"
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
                {t.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
