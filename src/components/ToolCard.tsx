import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tool, ToolCategory } from "@/lib/tools";
import { useFavorites } from "@/hooks/use-tool-state";

const CATEGORY_TONE: Record<ToolCategory, string> = {
  Formatters: "bg-sky-50 text-sky-700 ring-sky-100",
  Validators: "bg-teal-50 text-teal-700 ring-teal-100",
  Generators: "bg-blue-50 text-blue-700 ring-blue-100",
  Converters: "bg-amber-50 text-amber-700 ring-amber-100",
  "Text Tools": "bg-violet-50 text-violet-700 ring-violet-100",
  Encoders: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  "API Tools": "bg-indigo-50 text-indigo-700 ring-indigo-100",
  Utilities: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  Design: "bg-rose-50 text-rose-700 ring-rose-100",
};

interface Props {
  tool: Tool;
  index?: number;
}

export function ToolCard({ tool }: Props) {
  const Icon = tool.icon;
  const { isFav, toggle } = useFavorites();
  const fav = isFav(tool.slug);

  return (
    <Link
      to="/tools/$slug"
      params={{ slug: tool.slug }}
      className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-soft transition-colors hover:border-foreground/15"
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "grid h-9 w-9 place-items-center rounded-lg ring-1 ring-inset",
            CATEGORY_TONE[tool.category],
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-1.5">
          {tool.new && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-foreground px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-background">
              <Sparkles className="h-2.5 w-2.5" /> New
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(tool.slug);
            }}
            aria-label={fav ? "Unpin" : "Pin"}
            className={cn(
              "rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-accent hover:text-foreground",
              fav && "text-foreground",
            )}
          >
            <Star className={cn("h-3.5 w-3.5", fav && "fill-current")} />
          </button>
        </div>
      </div>

      <h3 className="mt-4 flex items-center gap-1 text-[14px] font-medium tracking-tight text-foreground">
        {tool.name}
        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </h3>
      <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">
        {tool.description}
      </p>
      <div className="mt-auto pt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {tool.category}
      </div>
    </Link>
  );
}
