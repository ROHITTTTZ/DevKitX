import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Command,
  CornerDownLeft,
  Lock,
  Search,
  Sparkles,
  Star,
  Wifi,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, TOOLS, type ToolCategory, searchTools } from "@/lib/tools";
import { useFavorites, useRecent, useRole, type DevRole } from "@/hooks/use-tool-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevKitX — 40+ Free Developer Utilities, in your browser" },
      {
        name: "description",
        content:
          "Free, private, browser-based developer tools. Format JSON, decode JWTs, generate UUIDs, hash strings, convert cURL, build QR codes and more — no signup, nothing leaves your device.",
      },
      { name: "keywords", content: "developer tools, json formatter, jwt decoder, base64, uuid generator, hash, qr code, curl converter, online tools" },
      { property: "og:title", content: "DevKitX — Free Developer Utilities" },
      { property: "og:description", content: "40+ fast, private, browser-based developer tools in one place." },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "DevKitX" },
      { name: "twitter:description", content: "40+ free, private, browser-based developer utilities." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

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

function Home() {
  const [q, setQ] = useState("");
  const { favorites, isFav, toggle } = useFavorites();
  const { recent } = useRecent();
  const { role, setRole } = useRole();
  const navigate = useNavigate();

  const searchRef = useRef<HTMLInputElement | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [highlight, setHighlight] = useState(0);

  // Spotlight: auto-focus on mount without scrolling the page
  useEffect(() => {
    searchRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus({ preventScroll: true });
        searchRef.current?.select();
      }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const pinnedSlugs = useMemo(
    () => Array.from(new Set([...favorites, ...recent])).slice(0, 4),
    [favorites, recent],
  );
  const pinned = pinnedSlugs
    .map((s) => TOOLS.find((t) => t.slug === s))
    .filter(Boolean) as typeof TOOLS;
  const fallbackPinned = TOOLS.filter((t) => t.popular).slice(0, 4);
  const showPinned = pinned.length > 0 ? pinned : fallbackPinned;
  const pinnedLabel = pinned.length > 0 ? "Recent & pinned" : "Most used";

  const recentTools = recent
    .map((s) => TOOLS.find((t) => t.slug === s))
    .filter(Boolean)
    .slice(0, 6) as typeof TOOLS;

  // Spotlight results (top 6)
  const spotlight = useMemo(() => {
    if (!q.trim()) return [];
    return searchTools(q).slice(0, 6);
  }, [q]);

  useEffect(() => setHighlight(0), [q]);

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (spotlight.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % spotlight.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + spotlight.length) % spotlight.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const t = spotlight[highlight];
      if (t) navigate({ to: "/tools/$slug", params: { slug: t.slug } });
    } else if (e.key === "Escape") {
      setQ("");
      (e.target as HTMLInputElement).blur();
    }
  };


  const featured = TOOLS.find((t) => t.slug === "json-formatter") ?? TOOLS[0];
  const featuredSecondary = TOOLS.filter(
    (t) => t.popular && t.slug !== featured.slug,
  ).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="overflow-hidden border-b border-border bg-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-28">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-soft">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              v1.0 · {TOOLS.length} tools shipped
              <span className="text-border">·</span>
              <span className="text-foreground">Changelog</span>
              <ArrowRight className="h-3 w-3" />
            </div>

            <h1 className="mt-6 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.025em] text-foreground sm:text-[3.5rem] lg:text-[4rem]">
              The developer
              <br />
              toolbox,{" "}
              <span className="text-muted-foreground">
                reimagined.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
              DevKitX is a fast, local-first utility suite for modern engineering workflows.
              Format, encode, generate and convert — without leaving your browser, signing in, or
              shipping data anywhere.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/tools"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-[14px] font-medium text-background shadow-soft transition-opacity hover:opacity-90"
              >
                Browse all tools <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => searchRef.current?.focus()}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[14px] font-medium text-foreground shadow-soft transition-colors hover:border-foreground/20"
              >
                <Command className="h-3.5 w-3.5" /> Quick open
                <kbd className="ml-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
                  ⌘K
                </kbd>
              </button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
              {[
                { icon: Lock, label: "100% client-side" },
                { icon: Zap, label: "Instant, zero-latency" },
                { icon: Wifi, label: "Works offline" },
                { icon: Check, label: "Free forever" },
              ].map((f) => (
                <li key={f.label} className="inline-flex items-center gap-1.5">
                  <f.icon className="h-3.5 w-3.5 text-foreground/70" /> {f.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Product preview */}
          <ProductPreview />
        </div>
      </section>

      {/* COMMAND BAR */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 120)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search tools, formats, encodings…  (press / to focus)"
              className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-24 text-[16px] text-foreground shadow-soft placeholder:text-muted-foreground/80 focus:border-foreground/15 focus:outline-none focus:ring-4 focus:ring-foreground/[0.05] transition-colors"
            />
            <kbd className="pointer-events-none absolute right-4 top-1/2 hidden h-7 -translate-y-1/2 items-center gap-1 rounded-md border border-border bg-muted px-2 font-mono text-[11px] font-medium text-muted-foreground sm:flex">
              ⌘K
            </kbd>

            {/* Spotlight results */}
            {searchFocused && spotlight.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
                {spotlight.map((t, i) => {
                  const Icon = t.icon;
                  return (
                    <Link
                      key={t.slug}
                      to="/tools/$slug"
                      params={{ slug: t.slug }}
                      onMouseEnter={() => setHighlight(i)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                        i === highlight ? "bg-accent" : "hover:bg-accent/60",
                      )}
                    >
                      <div
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset",
                          CATEGORY_TONE[t.category],
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px] font-medium text-foreground">
                          {t.name}
                        </div>
                        <div className="truncate text-[11.5px] text-muted-foreground">
                          {t.description}
                        </div>
                      </div>
                      <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">
                        {t.category}
                      </span>
                      {i === highlight && (
                        <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </Link>
                  );
                })}
                <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-2 text-[10.5px] text-muted-foreground">
                  <span>↑↓ navigate · ↵ open · esc clear</span>
                  <Link to="/tools" className="hover:text-foreground">
                    Browse all →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Continue Working */}
          {recentTools.length > 0 && (
            <div className="mt-6">
              <SectionLabel>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> Continue working
                </span>
              </SectionLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {recentTools.map((t) => {
                  const Icon = t.icon;
                  return (
                    <Link
                      key={t.slug}
                      to="/tools/$slug"
                      params={{ slug: t.slug }}
                      className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[12.5px] text-foreground shadow-soft transition-colors hover:border-foreground/20"
                    >
                      <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                      {t.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Your stack — role-based pinned categories */}
          <RoleSection role={role} onRoleChange={setRole} />


          {/* Recent / pinned */}
          <div className="mt-6">
            <SectionLabel>{pinnedLabel}</SectionLabel>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {showPinned.map((t) => {
                const Icon = t.icon;
                const fav = isFav(t.slug);
                return (
                  <Link
                    key={t.slug}
                    to="/tools/$slug"
                    params={{ slug: t.slug }}
                    className="group relative flex flex-col rounded-xl border border-border bg-card p-3.5 shadow-soft transition-colors hover:border-foreground/15"
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggle(t.slug);
                      }}
                      aria-label={fav ? "Unpin" : "Pin"}
                      className={cn(
                        "absolute right-2 top-2 rounded-md p-1 text-muted-foreground/60 opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100",
                        fav && "text-foreground opacity-100",
                      )}
                    >
                      <Star className={cn("h-3.5 w-3.5", fav && "fill-current")} />
                    </button>
                    <div
                      className={cn(
                        "grid h-8 w-8 place-items-center rounded-lg ring-1 ring-inset",
                        CATEGORY_TONE[t.category],
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="mt-3 text-[13px] font-medium leading-tight text-foreground">
                      {t.name}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">{t.category}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BENTO */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <SectionLabel>Featured</SectionLabel>
              <h2 className="mt-2 text-[28px] font-semibold tracking-tight text-foreground sm:text-[34px]">
                Built for the things you do daily.
              </h2>
            </div>
            <Link
              to="/tools"
              className="hidden shrink-0 items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
            >
              All tools <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <FeatureHeroCard tool={featured} />
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
              {featuredSecondary.map((t) => (
                <FeatureCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-8 rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <SectionLabel>Private by default</SectionLabel>
              <h3 className="mt-3 text-[26px] font-semibold tracking-tight text-foreground sm:text-[32px]">
                Your data never leaves your machine.
              </h3>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                Every utility runs entirely client-side. No servers, no logs, no telemetry. Open it
                in incognito, kill your wifi — it still works.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  to="/tools"
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-[14px] font-medium text-background hover:opacity-90"
                >
                  Start exploring <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-4 text-[14px] font-medium text-foreground hover:border-foreground/20"
                >
                  Open dashboard
                </Link>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
              {[
                { k: "Tools", v: `${TOOLS.length}` },
                { k: "Categories", v: `${CATEGORIES.length}` },
                { k: "Client-side", v: "100%" },
                { k: "Sign-up", v: "Never" },
              ].map((s) => (
                <div key={s.k} className="bg-card p-5">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {s.k}
                  </dt>
                  <dd className="mt-2 text-[28px] font-semibold tracking-tight text-foreground">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </span>
  );
}


function FeatureHeroCard({ tool }: { tool: (typeof TOOLS)[number] }) {
  const Icon = tool.icon;
  return (
    <Link
      to="/tools/$slug"
      params={{ slug: tool.slug }}
      className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-foreground/15 lg:min-h-[360px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
      />
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "grid h-11 w-11 place-items-center rounded-xl ring-1 ring-inset",
            CATEGORY_TONE[tool.category],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {tool.category}
        </span>
      </div>
      <div>
        <h3 className="text-[22px] font-semibold tracking-tight text-foreground">{tool.name}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          {tool.longDescription}
        </p>
        <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-foreground">
          Open tool
          <ArrowUpRight className="h-3.5 w-3.5 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function FeatureCard({ tool }: { tool: (typeof TOOLS)[number] }) {
  const Icon = tool.icon;
  return (
    <Link
      to="/tools/$slug"
      params={{ slug: tool.slug }}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-colors hover:border-foreground/15"
    >
      <div
        className={cn(
          "grid h-9 w-9 place-items-center rounded-lg ring-1 ring-inset",
          CATEGORY_TONE[tool.category],
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="mt-4 flex items-center gap-1 text-[15px] font-semibold tracking-tight text-foreground">
        {tool.name}
        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
        {tool.description}
      </p>
    </Link>
  );
}

function ProductPreview() {
  return (
    <div className="relative min-w-0">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-foreground/[0.04] via-transparent to-foreground/[0.06] blur-2xl"
      />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2.5 sm:px-4">
          <div className="flex shrink-0 gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          </div>
          <div className="mx-auto flex min-w-0 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 font-mono text-[10.5px] text-muted-foreground sm:text-[11px]">
            <Lock className="h-3 w-3 shrink-0" />
            <span className="truncate">stackscope.tools/json-formatter</span>
          </div>
          <kbd className="hidden shrink-0 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline">
            ⌘K
          </kbd>
        </div>

        {/* Body — fake JSON formatter */}
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Input
              </span>
              <span className="text-[10px] text-muted-foreground">12 lines</span>
            </div>
            <pre className="overflow-hidden font-mono text-[11px] leading-relaxed text-muted-foreground">
{`{"id":"u_482","name":"ada",
"role":"engineer","scopes":
["read","write","deploy"],
"created":1719600000,
"meta":{"team":"core"}}`}
            </pre>
          </div>
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-700">
                Valid · formatted
              </span>
              <span className="text-[10px] text-muted-foreground">2-space</span>
            </div>
            <pre className="overflow-hidden font-mono text-[11px] leading-relaxed">
<span className="text-zinc-400">{"{"}</span>{"\n"}
{"  "}<span className="text-violet-700">"id"</span>: <span className="text-emerald-700">"u_482"</span>,{"\n"}
{"  "}<span className="text-violet-700">"name"</span>: <span className="text-emerald-700">"ada"</span>,{"\n"}
{"  "}<span className="text-violet-700">"role"</span>: <span className="text-emerald-700">"engineer"</span>,{"\n"}
{"  "}<span className="text-violet-700">"scopes"</span>: [<span className="text-emerald-700">"read"</span>, …],{"\n"}
{"  "}<span className="text-violet-700">"meta"</span>: {"{ … }"}{"\n"}
<span className="text-zinc-400">{"}"}</span>
            </pre>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Local
          </span>
          <span>0 errors · 142 bytes</span>
        </div>
      </div>

      {/* Floating mini card */}
      <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-card p-3 shadow-elevated sm:block">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[12px] font-medium text-foreground">No network calls</div>
            <div className="text-[10.5px] text-muted-foreground">Verified — works offline</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ROLE_TOOLS: Record<DevRole, string[]> = {
  Frontend: ["html-formatter", "css-formatter", "js-formatter", "json-formatter", "color-palette", "markdown", "random-color", "url"],
  Backend: ["jwt-decoder", "jwt-generator", "hash", "uuid", "sql-formatter", "yaml-formatter", "base64", "json-to-ts", "curl-generator"],
  DevOps: ["yaml-formatter", "yaml-validator", "base64", "hash", "curl-generator", "curl-to-python", "timestamp", "url-parser"],
  Security: ["jwt-decoder", "hash", "password", "api-key", "base64", "url", "unicode-converter", "uuid"],
};

const ROLES: DevRole[] = ["Frontend", "Backend", "DevOps", "Security"];

function RoleSection({
  role,
  onRoleChange,
}: {
  role: DevRole | null;
  onRoleChange: (r: DevRole) => void;
}) {
  const active: DevRole = role ?? "Frontend";
  const slugs = ROLE_TOOLS[active];
  const tools = slugs
    .map((s) => TOOLS.find((t) => t.slug === s))
    .filter(Boolean) as typeof TOOLS;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionLabel>Your stack</SectionLabel>
        <div className="inline-flex rounded-full border border-border bg-card p-0.5 shadow-soft">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              className={cn(
                "h-7 rounded-full px-3 text-[12px] font-medium transition-colors",
                active === r
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.slug}
              to="/tools/$slug"
              params={{ slug: t.slug }}
              className="group flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-[12.5px] font-medium text-foreground shadow-soft transition-colors hover:border-foreground/20"
            >
              <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              <span className="truncate">{t.name.replace(/ (Formatter|Generator|Decoder|Encoder|Converter|Validator|Preview)/, "")}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
