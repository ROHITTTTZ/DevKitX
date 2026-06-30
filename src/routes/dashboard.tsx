import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Star, TrendingUp } from "lucide-react";
import { TOOLS } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";
import { useFavorites, useRecent } from "@/hooks/use-tool-state";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — DevKitX" },
      { name: "description", content: "Your favorite and recently used developer tools." },
      { property: "og:title", content: "Dashboard — DevKitX" },
      { property: "og:description", content: "Your personal hub of developer tools." },
    ],
    links: [{ rel: "canonical", href: "/dashboard" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { favorites } = useFavorites();
  const { recent } = useRecent();

  const favTools = favorites.map((s) => TOOLS.find((t) => t.slug === s)).filter(Boolean) as typeof TOOLS;
  const recentTools = recent.map((s) => TOOLS.find((t) => t.slug === s)).filter(Boolean) as typeof TOOLS;
  const trending = TOOLS.filter((t) => t.popular);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <header>
        <div className="text-xs font-medium uppercase tracking-wider text-brand">Workspace</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Your dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Quick access to your favorites and recently used tools.
        </p>
      </header>

      <Block icon={<Star className="h-4 w-4 text-brand" />} title="Favorites" empty={favTools.length === 0 ? "Star a tool to pin it here." : null}>
        {favTools.map((t, i) => (
          <ToolCard key={t.slug} tool={t} index={i} />
        ))}
      </Block>

      <Block icon={<Clock className="h-4 w-4 text-brand" />} title="Recently used" empty={recentTools.length === 0 ? "Tools you open will show up here." : null}>
        {recentTools.map((t, i) => (
          <ToolCard key={t.slug} tool={t} index={i} />
        ))}
      </Block>

      <Block icon={<TrendingUp className="h-4 w-4 text-brand" />} title="Trending now">
        {trending.map((t, i) => (
          <ToolCard key={t.slug} tool={t} index={i} />
        ))}
      </Block>

      <div className="mt-12">
        <Link
          to="/tools"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          Browse all tools <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Block({
  icon,
  title,
  empty,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  empty?: string | null;
  children: React.ReactNode;
}) {
  const arr = Array.isArray(children) ? children : [children];
  const hasContent = arr.flat().filter(Boolean).length > 0;
  return (
    <section className="mt-12">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold tracking-tight">
        {icon} {title}
      </h2>
      {hasContent ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">{empty}</p>
        </div>
      )}
    </section>
  );
}
