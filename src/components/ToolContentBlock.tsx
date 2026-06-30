import { Lightbulb, ListChecks, HelpCircle, Shield } from "lucide-react";
import type { Tool } from "@/lib/tools";
import { getToolContent } from "@/lib/tool-content";

interface Props {
  tool: Tool;
}

export function ToolContentBlock({ tool }: Props) {
  const c = getToolContent(tool.slug);
  return (
    <section className="mt-16 border-t border-border/60 pt-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* About + How To */}
        <div className="space-y-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
              <Lightbulb className="h-3.5 w-3.5" />
              About this tool
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {tool.name}
            </h2>
            <p className="mt-2 text-base text-muted-foreground">{c.tagline}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/80">
              {c.about}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <ListChecks className="h-3.5 w-3.5" />
              How to use
            </div>
            <ol className="mt-4 space-y-3">
              {c.howTo.map((step, i) => (
                <li key={i} className="flex gap-3 text-[15px] text-foreground/80">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border bg-card text-xs font-semibold text-foreground">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <HelpCircle className="h-3.5 w-3.5" />
              Frequently asked questions
            </div>
            <dl className="mt-4 divide-y divide-border/60 rounded-2xl border border-border bg-card">
              {c.faqs.map((f, i) => (
                <div key={i} className="p-5">
                  <dt className="text-[15px] font-semibold text-foreground">
                    {f.q}
                  </dt>
                  <dd className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Sidebar: use cases + privacy */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Common use cases
            </div>
            <ul className="mt-3 space-y-2.5">
              {c.useCases.map((u, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-[14px] leading-relaxed text-foreground/80"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                  {u}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand" />
              <div className="text-sm font-semibold">Private by default</div>
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
              Every DevKitX tool runs entirely in your browser. Your input
              is never uploaded, logged or stored on a server.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
