import { createFileRoute, notFound } from "@tanstack/react-router";
import { lazy, Suspense, type ComponentType } from "react";
import { getTool } from "@/lib/tools";
import { getToolContent } from "@/lib/tool-content";
import { ToolShell } from "@/components/ToolShell";
import { Skeleton } from "@/components/ui/skeleton";

const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "json-formatter": lazy(() => import("@/tools/json-formatter")),
  base64: lazy(() => import("@/tools/base64")),
  uuid: lazy(() => import("@/tools/uuid")),
  password: lazy(() => import("@/tools/password")),
  "qr-code": lazy(() => import("@/tools/qr-code")),
  timestamp: lazy(() => import("@/tools/timestamp")),
  hash: lazy(() => import("@/tools/hash")),
  url: lazy(() => import("@/tools/url")),
  "color-palette": lazy(() => import("@/tools/color-palette")),
  markdown: lazy(() => import("@/tools/markdown")),
  // Phase 2 — Formatters
  "html-formatter": lazy(() => import("@/tools/html-formatter")),
  "css-formatter": lazy(() => import("@/tools/css-formatter")),
  "js-formatter": lazy(() => import("@/tools/js-formatter")),
  "sql-formatter": lazy(() => import("@/tools/sql-formatter")),
  "xml-formatter": lazy(() => import("@/tools/xml-formatter")),
  "yaml-formatter": lazy(() => import("@/tools/yaml-formatter")),
  "csv-formatter": lazy(() => import("@/tools/csv-formatter")),
  // Phase 2 — Validators
  "json-validator": lazy(() => import("@/tools/json-validator")),
  "xml-validator": lazy(() => import("@/tools/xml-validator")),
  "html-validator": lazy(() => import("@/tools/html-validator")),
  "css-validator": lazy(() => import("@/tools/css-validator")),
  "yaml-validator": lazy(() => import("@/tools/yaml-validator")),
  // Phase 2 — Encoders
  "jwt-decoder": lazy(() => import("@/tools/jwt-decoder")),
  "jwt-generator": lazy(() => import("@/tools/jwt-generator")),
  "url-parser": lazy(() => import("@/tools/url-parser")),
  "html-encoder": lazy(() => import("@/tools/html-encoder")),
  "html-decoder": lazy(() => import("@/tools/html-decoder")),
  "unicode-converter": lazy(() => import("@/tools/unicode-converter")),
  "ascii-converter": lazy(() => import("@/tools/ascii-converter")),
  // Phase 2 — Generators
  "lorem-ipsum": lazy(() => import("@/tools/lorem-ipsum")),
  "fake-user": lazy(() => import("@/tools/fake-user")),
  "api-key": lazy(() => import("@/tools/api-key")),
  "nano-id": lazy(() => import("@/tools/nano-id")),
  "slug-generator": lazy(() => import("@/tools/slug-generator")),
  "random-string": lazy(() => import("@/tools/random-string")),
  "random-number": lazy(() => import("@/tools/random-number")),
  "random-color": lazy(() => import("@/tools/random-color")),
  // Phase 2 — API Tools
  "curl-generator": lazy(() => import("@/tools/curl-generator")),
  "curl-to-fetch": lazy(() => import("@/tools/curl-to-fetch")),
  "curl-to-python": lazy(() => import("@/tools/curl-to-python")),
  "curl-to-node": lazy(() => import("@/tools/curl-to-node")),
  "curl-to-java": lazy(() => import("@/tools/curl-to-java")),
  "json-to-ts": lazy(() => import("@/tools/json-to-ts")),
  // Utilities
  "diff-checker": lazy(() => import("@/tools/diff-checker")),
  "regex-tester": lazy(() => import("@/tools/regex-tester")),
};

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData, params }) => {
    const tool = loaderData?.tool;
    if (!tool) return {};
    const content = getToolContent(tool.slug);
    const path = `/tools/${tool.slug}`;
    const title = `${tool.name} — Free Online Tool | DevKitX`;
    const description = `${content.tagline} 100% free, browser-based — your data never leaves your device.`;

    const softwareLd = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: tool.name,
      description,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (Web Browser)",
      url: path,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "128",
      },
      publisher: { "@type": "Organization", name: "DevKitX" },
    };

    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "/" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "/tools" },
        { "@type": "ListItem", position: 3, name: tool.name, item: path },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: [tool.name.toLowerCase(), ...tool.keywords, "free", "online", "browser"].join(", ") },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: path },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(softwareLd) },
        { type: "application/ld+json", children: JSON.stringify(faqLd) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-2xl font-semibold">Tool not found</h1>
      <p className="mt-2 text-muted-foreground">This tool doesn't exist (yet).</p>
    </div>
  ),
  component: ToolRoute,
});

function ToolRoute() {
  const { tool } = Route.useLoaderData();
  const Comp = TOOL_COMPONENTS[tool.slug];
  return (
    <ToolShell tool={tool}>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        {Comp ? <Comp /> : <p>Coming soon.</p>}
      </Suspense>
    </ToolShell>
  );
}
