import {
  Braces,
  Binary,
  Fingerprint,
  KeyRound,
  QrCode,
  Clock,
  Hash,
  Link as LinkIcon,
  Palette,
  FileText,
  FileCode,
  Code2,
  FileType,
  Database,
  FileBox,
  ScrollText,
  Sheet,
  ShieldCheck,
  ShieldAlert,
  KeySquare,
  Lock,
  Globe,
  CodepenIcon,
  Terminal,
  Type,
  Hash as HashIcon,
  Pilcrow,
  UsersRound,
  Sparkles,
  Tag,
  Dice5,
  Shuffle,
  Pipette,
  ArrowRightLeft,
  type LucideIcon,
} from "lucide-react";

export type ToolCategory =
  | "Formatters"
  | "Validators"
  | "Generators"
  | "Converters"
  | "Text Tools"
  | "Encoders"
  | "API Tools"
  | "Utilities"
  | "Design";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: ToolCategory;
  icon: LucideIcon;
  keywords: string[];
  popular?: boolean;
  new?: boolean;
}

export const TOOLS: Tool[] = [
  // --- Phase 1 ---
  { slug: "json-formatter", name: "JSON Formatter", description: "Validate, beautify and minify JSON with syntax highlighting.", longDescription: "Paste any JSON to instantly format, validate and minify it. Errors are surfaced inline.", category: "Formatters", icon: Braces, keywords: ["json","format","beautify","minify","validate"], popular: true },
  { slug: "base64", name: "Base64 Encoder / Decoder", description: "Encode or decode Base64 strings with one click.", longDescription: "Convert text to Base64 or decode Base64 back to readable text.", category: "Encoders", icon: Binary, keywords: ["base64","encode","decode"], popular: true },
  { slug: "uuid", name: "UUID Generator", description: "Generate one or many RFC 4122 v4 UUIDs.", longDescription: "Cryptographically random UUIDs (v4) with bulk generation and download.", category: "Generators", icon: Fingerprint, keywords: ["uuid","guid","id","random"], popular: true },
  { slug: "password", name: "Password Generator", description: "Strong, customizable passwords generated in your browser.", longDescription: "Configure length and character sets. Includes a real-time strength meter.", category: "Generators", icon: KeyRound, keywords: ["password","secret","random"], popular: true },
  { slug: "qr-code", name: "QR Code Generator", description: "Create downloadable QR codes from any text or URL.", longDescription: "Generate high-resolution PNG QR codes with adjustable size.", category: "Generators", icon: QrCode, keywords: ["qr","code","barcode"] },
  { slug: "timestamp", name: "Timestamp Converter", description: "Convert between Unix timestamps and human-readable dates.", longDescription: "Bidirectional conversion with timezone awareness and a live clock.", category: "Converters", icon: Clock, keywords: ["unix","timestamp","date","time"] },
  { slug: "hash", name: "Hash Generator", description: "MD5, SHA-1, SHA-256 and SHA-512 hashes from any input.", longDescription: "Generate cryptographic hashes locally — your input never leaves the browser.", category: "Encoders", icon: Hash, keywords: ["hash","md5","sha1","sha256","sha512"] },
  { slug: "url", name: "URL Encoder / Decoder", description: "Percent-encode or decode URLs and query strings.", longDescription: "Useful for crafting query strings or debugging encoded URLs.", category: "Encoders", icon: LinkIcon, keywords: ["url","encode","decode","percent"] },
  { slug: "color-palette", name: "Color Palette Generator", description: "Generate harmonious palettes with HEX, RGB and HSL.", longDescription: "Random palettes you can copy in any common color format.", category: "Design", icon: Palette, keywords: ["color","palette","hex","rgb","hsl"] },
  { slug: "markdown", name: "Markdown Preview", description: "Live Markdown editor with HTML export.", longDescription: "Write Markdown with a live rendered preview, copy or export the HTML.", category: "Text Tools", icon: FileText, keywords: ["markdown","md","preview","html"] },

  // --- Phase 2: Formatters ---
  { slug: "html-formatter", name: "HTML Formatter", description: "Beautify and indent HTML markup.", longDescription: "Clean up minified or messy HTML with consistent 2-space indentation.", category: "Formatters", icon: FileCode, keywords: ["html","format","beautify","prettify"], popular: true, new: true },
  { slug: "css-formatter", name: "CSS Formatter", description: "Beautify CSS with consistent indentation.", longDescription: "Format stylesheets, normalize spacing and one declaration per line.", category: "Formatters", icon: Code2, keywords: ["css","format","beautify","prettify"], new: true },
  { slug: "js-formatter", name: "JavaScript Formatter", description: "Beautify JavaScript with sensible defaults.", longDescription: "Reformat minified JavaScript with consistent indentation and spacing.", category: "Formatters", icon: FileType, keywords: ["javascript","js","format","beautify","prettier"], popular: true, new: true },
  { slug: "sql-formatter", name: "SQL Formatter", description: "Pretty-print SQL queries with uppercase keywords.", longDescription: "Format SELECT, INSERT, UPDATE and DDL across many SQL dialects.", category: "Formatters", icon: Database, keywords: ["sql","format","beautify","query"], popular: true, new: true },
  { slug: "xml-formatter", name: "XML Formatter", description: "Indent and pretty-print XML documents.", longDescription: "Format XML payloads and SOAP responses with collapsible nesting.", category: "Formatters", icon: FileBox, keywords: ["xml","format","beautify","soap"], new: true },
  { slug: "yaml-formatter", name: "YAML Formatter", description: "Normalize and pretty-print YAML files.", longDescription: "Round-trip YAML through a parser to fix indentation and quoting.", category: "Formatters", icon: ScrollText, keywords: ["yaml","yml","format","beautify"], new: true },
  { slug: "csv-formatter", name: "CSV Formatter", description: "Align CSV columns into a readable table.", longDescription: "Parse CSV and align columns with padding for easy visual scanning.", category: "Formatters", icon: Sheet, keywords: ["csv","format","table","columns"], new: true },

  // --- Phase 2: Validators ---
  { slug: "json-validator", name: "JSON Validator", description: "Validate JSON syntax in real time.", longDescription: "Live JSON validation with detailed parser errors as you type.", category: "Validators", icon: ShieldCheck, keywords: ["json","validate","lint"], popular: true, new: true },
  { slug: "xml-validator", name: "XML Validator", description: "Validate XML well-formedness instantly.", longDescription: "Catches malformed tags, unclosed elements and entity errors.", category: "Validators", icon: ShieldAlert, keywords: ["xml","validate","wellformed"], new: true },
  { slug: "html-validator", name: "HTML Validator", description: "Spot common HTML issues and tag mismatches.", longDescription: "Lightweight HTML parser checks for unmatched tags and parse errors.", category: "Validators", icon: ShieldCheck, keywords: ["html","validate","lint"], new: true },
  { slug: "css-validator", name: "CSS Validator", description: "Validate CSS syntax with the browser's own parser.", longDescription: "Catches unbalanced braces and uses CSSStyleSheet for real validation.", category: "Validators", icon: ShieldAlert, keywords: ["css","validate","lint"], new: true },
  { slug: "yaml-validator", name: "YAML Validator", description: "Validate YAML syntax with line-accurate errors.", longDescription: "Real-time YAML validation powered by a full YAML 1.2 parser.", category: "Validators", icon: ShieldCheck, keywords: ["yaml","yml","validate","lint"], new: true },

  // --- Phase 2: Encoders ---
  { slug: "jwt-decoder", name: "JWT Decoder", description: "Decode JWT header and payload without verifying.", longDescription: "Inspect the header and claims of any JSON Web Token. Decoding only — no signature check.", category: "Encoders", icon: KeySquare, keywords: ["jwt","jose","token","decode"], popular: true, new: true },
  { slug: "jwt-generator", name: "JWT Generator", description: "Sign JWTs with HS256, HS384 or HS512.", longDescription: "Generate signed JSON Web Tokens with custom claims, secret and expiration.", category: "Encoders", icon: Lock, keywords: ["jwt","jose","sign","hs256","token"], new: true },
  { slug: "url-parser", name: "URL Parser", description: "Break a URL into protocol, host, path and query.", longDescription: "Decomposes any URL using the browser's URL API.", category: "Encoders", icon: Globe, keywords: ["url","parse","query","host"], new: true },
  { slug: "html-encoder", name: "HTML Encoder", description: "Escape characters into HTML entities.", longDescription: "Encode &, <, >, \" and ' into safe HTML entities.", category: "Encoders", icon: CodepenIcon, keywords: ["html","encode","entity","escape"], new: true },
  { slug: "html-decoder", name: "HTML Decoder", description: "Decode HTML entities back to plain text.", longDescription: "Turns &amp;, &lt;, &#39; and others back into normal characters.", category: "Encoders", icon: CodepenIcon, keywords: ["html","decode","entity","unescape"], new: true },
  { slug: "unicode-converter", name: "Unicode Converter", description: "Convert non-ASCII characters into \\uXXXX escapes.", longDescription: "Escape unicode codepoints into JavaScript-compatible \\uXXXX sequences.", category: "Encoders", icon: Type, keywords: ["unicode","escape","u00","codepoint"], new: true },
  { slug: "ascii-converter", name: "ASCII Converter", description: "Convert text to decimal ASCII codes.", longDescription: "Get the decimal code point for every character in a string.", category: "Encoders", icon: HashIcon, keywords: ["ascii","charcode","decimal"], new: true },

  // --- Phase 2: Generators ---
  { slug: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate placeholder paragraphs, sentences or words.", longDescription: "Classic Lorem Ipsum filler text in any quantity, instantly.", category: "Generators", icon: Pilcrow, keywords: ["lorem","ipsum","placeholder","filler","text"], popular: true, new: true },
  { slug: "fake-user", name: "Fake User Generator", description: "Realistic fake user profiles for prototypes.", longDescription: "Generate JSON user records with names, emails, addresses and avatars.", category: "Generators", icon: UsersRound, keywords: ["faker","user","mock","seed","fixtures"], popular: true, new: true },
  { slug: "api-key", name: "API Key Generator", description: "Cryptographically random API keys with custom prefix.", longDescription: "Strong API keys generated in the browser with WebCrypto.", category: "Generators", icon: Sparkles, keywords: ["api","key","secret","token"], new: true },
  { slug: "nano-id", name: "Nano ID Generator", description: "Tiny, URL-safe unique IDs powered by nanoid.", longDescription: "Generate Nano IDs with custom length and alphabet.", category: "Generators", icon: Sparkles, keywords: ["nanoid","id","random","unique"], new: true },
  { slug: "slug-generator", name: "Slug Generator", description: "Turn any string into a clean URL slug.", longDescription: "Convert titles into lowercase, hyphenated, URL-safe slugs.", category: "Generators", icon: Tag, keywords: ["slug","url","seo","kebab"], new: true },
  { slug: "random-string", name: "Random String Generator", description: "Random strings with customizable charsets.", longDescription: "Pick length, count and which character classes to include.", category: "Generators", icon: Shuffle, keywords: ["random","string","generator"], new: true },
  { slug: "random-number", name: "Random Number Generator", description: "Random numbers in a range, optionally unique.", longDescription: "Generate random integers between min and max, with deduplication.", category: "Generators", icon: Dice5, keywords: ["random","number","integer"], new: true },
  { slug: "random-color", name: "Random Color Generator", description: "Generate a grid of random HEX colors.", longDescription: "Click any swatch to copy its HEX value.", category: "Generators", icon: Pipette, keywords: ["color","random","hex","swatch"], new: true },

  // --- Phase 2: API Tools ---
  { slug: "curl-generator", name: "cURL Generator", description: "Build a curl command from a friendly form.", longDescription: "Compose method, URL, headers and body — get a copy-ready curl command.", category: "API Tools", icon: Terminal, keywords: ["curl","http","request","api","generate"], popular: true, new: true },
  { slug: "curl-to-fetch", name: "cURL to Fetch", description: "Convert curl commands to JavaScript fetch().", longDescription: "Paste any curl command and get equivalent fetch() code.", category: "API Tools", icon: ArrowRightLeft, keywords: ["curl","fetch","javascript","convert"], popular: true, new: true },
  { slug: "curl-to-python", name: "cURL to Python", description: "Convert curl to Python (requests).", longDescription: "Get idiomatic Python requests code from any curl command.", category: "API Tools", icon: ArrowRightLeft, keywords: ["curl","python","requests","convert"], new: true },
  { slug: "curl-to-node", name: "cURL to Node.js", description: "Convert curl to Node.js (native http).", longDescription: "Generate Node.js code from any curl command.", category: "API Tools", icon: ArrowRightLeft, keywords: ["curl","node","nodejs","convert"], new: true },
  { slug: "curl-to-java", name: "cURL to Java", description: "Convert curl commands to Java code.", longDescription: "Generate Java HttpClient code from any curl command.", category: "API Tools", icon: ArrowRightLeft, keywords: ["curl","java","convert"], new: true },
  { slug: "json-to-ts", name: "JSON to TypeScript", description: "Generate TypeScript interfaces from JSON.", longDescription: "Paste a JSON sample to scaffold matching TypeScript interfaces.", category: "API Tools", icon: Braces, keywords: ["json","typescript","interface","types","convert"], popular: true, new: true },

  // --- Utilities ---
  { slug: "diff-checker", name: "Diff Checker", description: "Compare two texts and see additions and removals side by side.", longDescription: "Line-by-line diff with ignore-whitespace, ignore-case and a copyable patch.", category: "Utilities", icon: ArrowRightLeft, keywords: ["diff","compare","text","patch","changes"], popular: true, new: true },
  { slug: "regex-tester", name: "Regex Tester", description: "Test JavaScript regular expressions with live matches and a cheatsheet.", longDescription: "Real-time matching, capture groups, replace preview and a built-in regex cheatsheet.", category: "Utilities", icon: Code2, keywords: ["regex","regexp","pattern","match","test","cheatsheet"], popular: true, new: true },
];

export const CATEGORIES: ToolCategory[] = [
  "Formatters",
  "Validators",
  "Generators",
  "Encoders",
  "API Tools",
  "Converters",
  "Text Tools",
  "Design",
  "Utilities",
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS;
  return TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.includes(q)),
  );
}
