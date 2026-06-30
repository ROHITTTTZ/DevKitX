import { TOOLS, type Tool } from "@/lib/tools";

export interface ToolContent {
  tagline: string;
  about: string;
  useCases: string[];
  howTo: string[];
  faqs: { q: string; a: string }[];
}

const SPECIFIC: Record<string, ToolContent> = {
  "json-formatter": {
    tagline: "Format, validate and minify JSON instantly in your browser.",
    about:
      "DevKitX's JSON Formatter pretty-prints, validates and minifies JSON of any size. Parsing happens entirely on your device — no upload, no logging, no size limits beyond what your browser can handle.",
    useCases: [
      "Beautify API responses while debugging requests",
      "Validate JSON config files before committing",
      "Minify JSON before embedding into a payload",
      "Inspect deeply-nested objects with collapsible nodes",
    ],
    howTo: [
      "Paste your JSON into the input panel",
      "Choose Format to indent or Minify to compress",
      "Errors are highlighted with the exact line and column",
      "Copy the result with one click",
    ],
    faqs: [
      { q: "Is my JSON sent to a server?", a: "No. All formatting and validation runs locally in your browser using the native JSON parser. Nothing leaves your device." },
      { q: "What's the maximum file size?", a: "There's no hard limit — performance depends on your browser. Most modern browsers handle multi-megabyte JSON without issue." },
      { q: "What's the difference between formatting and minifying?", a: "Formatting adds indentation and line breaks so JSON is readable. Minifying strips all whitespace to produce the smallest possible payload." },
      { q: "Why am I getting a parse error?", a: "Common causes are trailing commas, single quotes instead of double quotes, unquoted keys, or missing brackets. The error line/column points to the first invalid token." },
    ],
  },
  base64: {
    tagline: "Encode text to Base64 or decode Base64 strings back to plain text.",
    about:
      "Base64 is the standard way to embed binary data inside text-only contexts like JSON, URLs, emails and data URIs. DevKitX's Base64 tool encodes and decodes UTF-8 safely in your browser.",
    useCases: [
      "Encode an image or file fragment into a data URI",
      "Decode Base64 fields from JWT or API payloads",
      "Inspect Basic Auth headers",
      "Move binary fixtures into JSON-friendly tests",
    ],
    howTo: [
      "Paste your text or Base64 string",
      "Pick Encode or Decode",
      "Copy the result — unicode is handled correctly",
    ],
    faqs: [
      { q: "Is Base64 encryption?", a: "No. Base64 is encoding, not encryption — anyone can decode it. Never use it to hide passwords or secrets." },
      { q: "Does this handle emoji and non-ASCII characters?", a: "Yes. Input is converted to UTF-8 bytes before encoding, so emoji, Chinese, Arabic and other scripts round-trip correctly." },
      { q: "Can I decode Base64URL?", a: "Yes — the decoder accepts both standard Base64 and the URL-safe variant used in JWTs (with - and _ instead of + and /)." },
    ],
  },
  uuid: {
    tagline: "Generate cryptographically-random UUID v4 identifiers.",
    about:
      "UUID v4 produces 128-bit random identifiers with a vanishingly small collision probability. Generate one or thousands at a time, copy or download as a list.",
    useCases: [
      "Seed test data with stable unique IDs",
      "Generate primary keys for offline-first apps",
      "Produce idempotency keys for API requests",
      "Bulk-create IDs for fixtures and migrations",
    ],
    howTo: [
      "Choose how many UUIDs you need",
      "Click Generate",
      "Copy individually or download the full list",
    ],
    faqs: [
      { q: "Are these UUIDs truly random?", a: "Yes — they're generated with crypto.randomUUID() / WebCrypto, which uses the operating system's secure random source." },
      { q: "Should I use UUID v4 or v7?", a: "v4 is fully random and best for opaque IDs. v7 is time-ordered and better for database primary keys. This tool generates v4 — the most widely supported variant." },
      { q: "What's the collision probability?", a: "With 2^122 possible values, you'd need to generate a billion UUIDs per second for ~85 years to have a 50% chance of one collision." },
    ],
  },
  password: {
    tagline: "Generate strong, customizable passwords entirely in your browser.",
    about:
      "Configure length, character classes and quantity. Every password is generated with WebCrypto and never transmitted or stored.",
    useCases: [
      "Create secure passwords for new accounts",
      "Generate temporary credentials for testing",
      "Produce environment-specific secrets",
    ],
    howTo: [
      "Adjust the length slider and character set toggles",
      "Click Generate",
      "Copy — the strength meter shows entropy live",
    ],
    faqs: [
      { q: "How strong is 'strong enough'?", a: "16+ characters with mixed case, numbers and symbols (≈100 bits of entropy) is considered strong against brute force for the foreseeable future." },
      { q: "Are passwords logged anywhere?", a: "No. They're generated in your browser and never sent over the network. Close the tab and they're gone." },
      { q: "Why exclude similar characters?", a: "Excluding 0/O, 1/l/I avoids transcription mistakes when reading a password aloud or copying from print." },
    ],
  },
  "jwt-decoder": {
    tagline: "Decode and inspect any JSON Web Token's header and payload.",
    about:
      "Paste a JWT to instantly see its header, claims and expiration. Decoding is local-only and does not verify the signature — perfect for debugging tokens during development.",
    useCases: [
      "Inspect access and ID tokens during OAuth flows",
      "Debug expired or malformed tokens",
      "Read custom claims while developing auth code",
    ],
    howTo: [
      "Paste your JWT into the input",
      "Header and payload are decoded as JSON",
      "Expiry, issued-at and other timestamps render in human-readable form",
    ],
    faqs: [
      { q: "Does this verify the signature?", a: "No. Decoding only — signature verification requires the secret or public key, which should never be pasted into a third-party tool." },
      { q: "Is my token sent anywhere?", a: "No. The decode happens entirely in your browser via Base64URL decoding." },
      { q: "What if my token isn't a JWT?", a: "JWTs have exactly three Base64URL segments separated by dots. Anything else will surface a parse error." },
    ],
  },
  hash: {
    tagline: "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any input.",
    about:
      "Cryptographic hashes for fingerprinting files, verifying integrity and (for SHA-2) password hashing. All hashing runs locally with WebCrypto.",
    useCases: [
      "Verify file or string integrity",
      "Generate cache-busting fingerprints",
      "Produce stable IDs from content",
    ],
    howTo: ["Paste input", "Pick an algorithm", "Copy the hex digest"],
    faqs: [
      { q: "Which algorithm should I use?", a: "SHA-256 is the safe default. MD5 and SHA-1 are exposed only for legacy compatibility — both are broken for collision resistance." },
      { q: "Can I hash files?", a: "This tool hashes text input. For file hashing in the browser, drop the file into the JSON Formatter and copy its contents, or open an issue." },
    ],
  },
  "qr-code": {
    tagline: "Generate downloadable PNG QR codes from any text or URL.",
    about:
      "Create high-resolution QR codes that scan reliably from print or screens. Adjust size and download instantly.",
    useCases: ["Share a URL via print or slides", "Wi-Fi credentials on a poster", "App download links"],
    howTo: ["Type the URL or text", "Adjust size", "Download the PNG"],
    faqs: [
      { q: "What's the maximum content length?", a: "QR codes scale with content. For URLs under 200 characters you'll get a clean, easy-to-scan code; longer payloads become dense quickly." },
      { q: "Does the QR contain my data?", a: "Yes — the QR encodes exactly what you typed. It's not a redirect through any server." },
    ],
  },
  "lorem-ipsum": {
    tagline: "Generate placeholder Lorem Ipsum paragraphs, sentences or words.",
    about:
      "Classic filler text for design mockups and prototypes, in any quantity. Output is plain text ready to paste into Figma, your CMS, or unit-test fixtures.",
    useCases: ["UI mockups", "Email template previews", "CMS seed data"],
    howTo: ["Pick paragraphs / sentences / words", "Set the count", "Copy"],
    faqs: [
      { q: "Why Lorem Ipsum and not English?", a: "Latin-looking gibberish lets you focus on layout and typography without your brain auto-parsing the content." },
      { q: "Can I get other placeholder languages?", a: "Use the Fake User generator for richer mock data including names, emails and addresses." },
    ],
  },
  "curl-to-fetch": {
    tagline: "Convert any curl command into a JavaScript fetch() call.",
    about:
      "Paste a curl command copied from your terminal or browser DevTools and get equivalent, idiomatic fetch() code with headers, body and method preserved.",
    useCases: ["Port API examples from docs into your frontend", "Reproduce a network request from DevTools in code"],
    howTo: ["Paste the curl command", "Copy the generated fetch code"],
    faqs: [
      { q: "Which curl flags are supported?", a: "-X, -H, -d / --data, -u, --url, multi-line backslash continuations and most common variants." },
      { q: "What about cookies and auth?", a: "-u username:password is converted to a Basic Auth header. Cookies passed via -H \"Cookie: ...\" are preserved." },
    ],
  },
  "json-to-ts": {
    tagline: "Generate TypeScript interfaces from any JSON sample.",
    about:
      "Paste a representative JSON object and get matching TypeScript interfaces — handy for typing API responses you don't control.",
    useCases: ["Scaffold types for a new API integration", "Generate fixtures' types from sample payloads"],
    howTo: ["Paste a JSON sample", "Name the root interface", "Copy the generated types"],
    faqs: [
      { q: "Does it handle nested objects?", a: "Yes — nested objects get their own named interfaces, and arrays are inferred from the first element." },
      { q: "What about optional fields?", a: "Provide a payload that exercises both the present and absent case, or hand-edit `?` afterwards." },
    ],
  },
};

function fallback(tool: Tool): ToolContent {
  return {
    tagline: tool.description,
    about: `${tool.longDescription} DevKitX's ${tool.name} runs entirely in your browser — your input never leaves your device.`,
    useCases: [
      `Use ${tool.name} while debugging`,
      `Prototype faster without leaving your workflow`,
      `Replace ad-hoc scripts with a focused, keyboard-first UI`,
    ],
    howTo: [
      "Paste or type your input",
      "The result appears instantly",
      "Copy with one click",
    ],
    faqs: [
      {
        q: "Is my data sent to a server?",
        a: `No. ${tool.name}, like every DevKitX tool, processes everything locally in your browser. No accounts, no uploads, no logging.`,
      },
      {
        q: "Does it work offline?",
        a: "Yes — once the page is loaded the tool runs without a network connection.",
      },
      {
        q: "Is DevKitX free?",
        a: "Yes. The full collection of DevKitX developer tools is free to use, with no signup required.",
      },
    ],
  };
}

export function getToolContent(slug: string): ToolContent {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) return fallback({ slug, name: "Tool", description: "", longDescription: "", category: "Utilities", icon: {} as never, keywords: [] });
  return SPECIFIC[slug] ?? fallback(tool);
}
