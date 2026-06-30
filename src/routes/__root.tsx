import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "@/hooks/use-theme";
import { Toaster } from "@/components/ui/sonner";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { QuickDock } from "@/components/QuickDock";

function NotFoundComponent() {
  const popular = [
    { to: "/tools/json-formatter", label: "JSON Formatter" },
    { to: "/tools/jwt-decoder", label: "JWT Decoder" },
    { to: "/tools/regex-tester", label: "Regex Tester" },
    { to: "/tools/diff-checker", label: "Diff Checker" },
    { to: "/tools/uuid", label: "UUID Generator" },
    { to: "/tools/base64", label: "Base64" },
  ];
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-20">
      {/* Soft gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(600px circle at 30% 20%, oklch(0.95 0.05 260 / 0.5), transparent), radial-gradient(500px circle at 80% 80%, oklch(0.95 0.04 300 / 0.5), transparent)",
        }}
      />
      <div className="relative mx-auto w-full max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Error 404
        </div>
        <h1 className="mt-6 bg-gradient-to-br from-foreground to-foreground/40 bg-clip-text text-7xl font-bold tracking-tight text-transparent sm:text-8xl">
          Page not found
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground">
          The page you're looking for doesn't exist, was moved, or might be a typo in the URL.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm transition-opacity hover:opacity-90"
          >
            Back to home
          </Link>
          <Link
            to="/tools"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            Browse all tools
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Popular tools
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {popular.map((p) => (
              <Link
                key={p.to}
                to={p.to}
                className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. You can retry or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DevKitX — 40+ Free Developer Utilities" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      {
        name: "description",
        content:
          "Free, fast, private developer tools: JSON formatter, JWT decoder, Base64, UUID, hash, QR code, cURL converters and more — all running in your browser.",
      },
      { name: "theme-color", content: "#ffffff" },
      { property: "og:site_name", content: "DevKitX" },
      { property: "og:title", content: "DevKitX — 40+ Free Developer Utilities" },
      {
        property: "og:description",
        content:
          "A premium collection of free, browser-based developer utilities. Format JSON, decode JWTs, generate UUIDs, convert cURL and more — privately, in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "DevKitX" },
      { name: "twitter:description", content: "40+ free, private, browser-based developer utilities." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        href: "/favicon.png",
        type: "image/png",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "DevKitX",
          url: "/",
          potentialAction: {
            "@type": "SearchAction",
            target: "/tools?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "DevKitX",
          url: "/",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('ss-theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="flex min-h-screen flex-col">
          <Topbar />
          <main className="flex-1 pb-24 sm:pb-28">
            <Outlet />
          </main>
          <Footer />
        </div>
        <QuickDock />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
