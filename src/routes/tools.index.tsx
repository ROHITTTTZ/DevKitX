import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { CATEGORIES, TOOLS, type ToolCategory, searchTools } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  cat: z.string().optional(),
  sort: z.enum(["popular", "az", "new"]).optional(),
});

export const Route = createFileRoute("/tools/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "All Developer Tools — DevKitX" },
      { name: "description", content: "Browse every DevKitX developer tool — formatters, validators, encoders, generators, API tools and more. All free and browser-based." },
      { property: "og:title", content: "All Developer Tools — DevKitX" },
      { property: "og:description", content: "Every browser-based developer utility, organized by category." },
      { property: "og:url", content: "/tools" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "All Developer Tools — DevKitX" },
      { name: "twitter:description", content: "Every browser-based developer utility, organized." },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: ToolsIndex,
});

function ToolsIndex() {
  const { cat, sort = "popular" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = searchTools(q);
    if (cat) list = list.filter((t) => t.category === cat);
    if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "new") list = [...list].sort((a, b) => Number(!!b.new) - Number(!!a.new));
    if (sort === "popular") list = [...list].sort((a, b) => Number(!!b.popular) - Number(!!a.popular));
    return list;
  }, [q, cat, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="max-w-2xl">
        <div className="text-xs font-medium uppercase tracking-wider text-brand">Library</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">All tools</h1>
        <p className="mt-2 text-muted-foreground">
          {TOOLS.length} polished utilities. Filter by category or search anything.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-3">
            <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </div>
            <div className="flex flex-col">
              <FilterButton
                active={!cat}
                onClick={() => navigate({ search: { sort } })}
              >
                All
                <span className="ml-auto text-xs text-muted-foreground">{TOOLS.length}</span>
              </FilterButton>
              {CATEGORIES.map((c) => {
                const count = TOOLS.filter((t) => t.category === c).length;
                if (count === 0) return null;
                return (
                  <FilterButton
                    key={c}
                    active={cat === c}
                    onClick={() => navigate({ search: { cat: c, sort } })}
                  >
                    {c}
                    <span className="ml-auto text-xs text-muted-foreground">{count}</span>
                  </FilterButton>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3">
            <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sort
            </div>
            {(
              [
                { k: "popular", l: "Popularity" },
                { k: "new", l: "Recently added" },
                { k: "az", l: "Alphabetical" },
              ] as const
            ).map((s) => (
              <FilterButton
                key={s.k}
                active={sort === s.k}
                onClick={() => navigate({ search: { cat: cat as ToolCategory | undefined, sort: s.k } })}
              >
                {s.l}
              </FilterButton>
            ))}
          </div>
        </aside>

        <div>
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tools…"
              className="h-11 rounded-xl pl-10"
            />
          </div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-sm text-muted-foreground">No tools match your filters.</p>
              <Link
                to="/tools"
                className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
              >
                Reset
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((t, i) => (
                <ToolCard key={t.slug} tool={t} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
