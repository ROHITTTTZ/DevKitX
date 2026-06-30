import { createFileRoute, notFound } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { getTool } from "@/lib/tools";
import { getToolContent } from "@/lib/tool-content";
import { ToolShell } from "@/components/ToolShell";

import JsonFormatter from "@/tools/json-formatter";
import Base64Tool from "@/tools/base64";
import UuidTool from "@/tools/uuid";
import PasswordTool from "@/tools/password";
import QrCodeTool from "@/tools/qr-code";
import TimestampTool from "@/tools/timestamp";
import HashTool from "@/tools/hash";
import UrlTool from "@/tools/url";
import ColorPaletteTool from "@/tools/color-palette";
import MarkdownTool from "@/tools/markdown";
import HtmlFormatter from "@/tools/html-formatter";
import CssFormatter from "@/tools/css-formatter";
import JsFormatter from "@/tools/js-formatter";
import SqlFormatter from "@/tools/sql-formatter";
import XmlFormatter from "@/tools/xml-formatter";
import YamlFormatter from "@/tools/yaml-formatter";
import CsvFormatter from "@/tools/csv-formatter";
import JsonValidator from "@/tools/json-validator";
import XmlValidator from "@/tools/xml-validator";
import HtmlValidator from "@/tools/html-validator";
import CssValidator from "@/tools/css-validator";
import YamlValidator from "@/tools/yaml-validator";
import JwtDecoder from "@/tools/jwt-decoder";
import JwtGenerator from "@/tools/jwt-generator";
import UrlParser from "@/tools/url-parser";
import HtmlEncoder from "@/tools/html-encoder";
import HtmlDecoder from "@/tools/html-decoder";
import UnicodeConverter from "@/tools/unicode-converter";
import AsciiConverter from "@/tools/ascii-converter";
import LoremIpsum from "@/tools/lorem-ipsum";
import FakeUser from "@/tools/fake-user";
import ApiKeyTool from "@/tools/api-key";
import NanoIdTool from "@/tools/nano-id";
import SlugGenerator from "@/tools/slug-generator";
import RandomString from "@/tools/random-string";
import RandomNumber from "@/tools/random-number";
import RandomColor from "@/tools/random-color";
import CurlGenerator from "@/tools/curl-generator";
import CurlToFetch from "@/tools/curl-to-fetch";
import CurlToPython from "@/tools/curl-to-python";
import CurlToNode from "@/tools/curl-to-node";
import CurlToJava from "@/tools/curl-to-java";
import JsonToTs from "@/tools/json-to-ts";
import DiffChecker from "@/tools/diff-checker";
import RegexTester from "@/tools/regex-tester";

const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "json-formatter": JsonFormatter,
  base64: Base64Tool,
  uuid: UuidTool,
  password: PasswordTool,
  "qr-code": QrCodeTool,
  timestamp: TimestampTool,
  hash: HashTool,
  url: UrlTool,
  "color-palette": ColorPaletteTool,
  markdown: MarkdownTool,
  "html-formatter": HtmlFormatter,
  "css-formatter": CssFormatter,
  "js-formatter": JsFormatter,
  "sql-formatter": SqlFormatter,
  "xml-formatter": XmlFormatter,
  "yaml-formatter": YamlFormatter,
  "csv-formatter": CsvFormatter,
  "json-validator": JsonValidator,
  "xml-validator": XmlValidator,
  "html-validator": HtmlValidator,
  "css-validator": CssValidator,
  "yaml-validator": YamlValidator,
  "jwt-decoder": JwtDecoder,
  "jwt-generator": JwtGenerator,
  "url-parser": UrlParser,
  "html-encoder": HtmlEncoder,
  "html-decoder": HtmlDecoder,
  "unicode-converter": UnicodeConverter,
  "ascii-converter": AsciiConverter,
  "lorem-ipsum": LoremIpsum,
  "fake-user": FakeUser,
  "api-key": ApiKeyTool,
  "nano-id": NanoIdTool,
  "slug-generator": SlugGenerator,
  "random-string": RandomString,
  "random-number": RandomNumber,
  "random-color": RandomColor,
  "curl-generator": CurlGenerator,
  "curl-to-fetch": CurlToFetch,
  "curl-to-python": CurlToPython,
  "curl-to-node": CurlToNode,
  "curl-to-java": CurlToJava,
  "json-to-ts": JsonToTs,
  "diff-checker": DiffChecker,
  "regex-tester": RegexTester,
};

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    return { slug: tool.slug };   // ✅ only the slug (serializable)
  },
  head: ({ loaderData }) => {
    const slug = loaderData?.slug;
    if (!slug) return {};
    const tool = getTool(slug);
    if (!tool) return {};
    const content = getToolContent(tool.slug);
    const path = `/tools/${tool.slug}`;
    const title = `${tool.name} — Free Online Tool | DevKitX`;
    const description = `${content.tagline} 100% free, browser-based — your data never leaves your device.`;

    // ... keep your existing softwareLd / faqLd / breadcrumbLd / meta / links / scripts here unchanged ...
    return {
      meta: [
        { title },
        { name: "description", content: description },
        // (keep the rest of your meta exactly as before)
      ],
      links: [{ rel: "canonical", href: path }],
    };
  },
  notFoundComponent: () => (
    <div className="p-8">
      <h2>Tool not found</h2>
      <p>This tool doesn't exist (yet).</p>
    </div>
  ),
  component: ToolRoute,
});

function ToolRoute() {
  const { slug } = Route.useLoaderData();        // ✅ only slug
  const tool = getTool(slug)!;                   // re-resolve in component
  const Comp = TOOL_COMPONENTS[slug];
  return (
    <ToolShell tool={tool}>
      {Comp ? <Comp /> : <p>Coming soon.</p>}
    </ToolShell>
  );
}
