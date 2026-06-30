import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Star, Clock, X } from "lucide-react";
import { TOOLS, CATEGORIES, type Tool } from "@/lib/tools";
import { useFavorites, useRecent } from "@/hooks/use-tool-state";
import { cn } from "@/lib/utils";

interface Props {
  activeSlug: string;
  onNavigate?: () => void;
}

export function ToolSidebar({ activeSlug, onNavigate }: Props) {
  const [q, setQ] = useState("");
  const { favorites } = useFavorites();
  const { recent } = useRecent();

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return TOOLS;
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.keywords.some((k) => k.includes(query)),
    );
  }, [q]);

  const grouped = useMemo(() => {
    const map = new Map<string, Tool[]>();
    for (const t of filtered) {
      const arr = map.get(t.category) ?? [];
      arr.push(t);
      map.set(t.category, arr);
    }
    return map;
  }, [filtered]);

  const favTools = TOOLS.filter((t) => favorites.includes(t.slug));
  const recentTools = recent
    .map((s) => TOOLS.find((t) => t.slug === s))
    .filter((t): t is Tool => Boolean(t) && t!.slug !== activeSlug)
    .slice(0, 5);

  const Row = ({ tool }: { tool: Tool }) => {
    const Icon = tool.icon;
    const active = tool.slug === activeSlug;
    return (
      <Link
        to="/tools/$slug"
        params={{ slug: tool.slug }}
        onClick={onNavigate}
        className={cn(
          "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
          active
            ? "bg-accent text-foreground font-medium"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
        )}
      >
        <Icon className={cn("h-3.5 w-3.5 shrink-0", active && "text-brand")} />
        <span className="truncate">{tool.name}</span>
      </Link>
    );
  };

  return (
    <aside className="flex h-full flex-col gap-4 overflow-hidden">
      <div className="relative shrink-0">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter tools…"
          className="h-9 w-full rounded-md border border-border bg-muted/40 pl-8 pr-8 text-sm outline-none transition-colors focus:border-foreground/30 focus:bg-background"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="-mr-2 flex-1 space-y-5 overflow-y-auto pr-2">
        {!q && favTools.length > 0 && (
          <Section icon={<Star className="h-3 w-3 fill-brand text-brand" />} label="Pinned">
            {favTools.map((t) => (
              <Row key={t.slug} tool={t} />
            ))}
          </Section>
        )}

        {!q && recentTools.length > 0 && (
          <Section icon={<Clock className="h-3 w-3" />} label="Recent">
            {recentTools.map((t) => (
              <Row key={t.slug} tool={t} />
            ))}
          </Section>
        )}

        {CATEGORIES.map((cat) => {
          const list = grouped.get(cat);
          if (!list || list.length === 0) return null;
          return (
            <Section key={cat} label={cat} count={list.length}>
              {list.map((t) => (
                <Row key={t.slug} tool={t} />
              ))}
            </Section>
          );
        })}

        {filtered.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            No tools match “{q}”.
          </p>
        )}
      </div>
    </aside>
  );
}

function Section({
  icon,
  label,
  count,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
        {icon}
        <span>{label}</span>
        {typeof count === "number" && (
          <span className="ml-auto font-mono text-[10px] tabular-nums text-muted-foreground/60">
            {count}
          </span>
        )}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
