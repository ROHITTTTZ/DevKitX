import { useMemo, useState } from "react";
import { AlertTriangle, BookOpen, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FLAGS = [
  { f: "g", label: "Global", desc: "Find all matches" },
  { f: "i", label: "Ignore case", desc: "Case-insensitive matching" },
  { f: "m", label: "Multiline", desc: "^ and $ match line breaks" },
  { f: "s", label: "Dotall", desc: ". matches newlines" },
  { f: "u", label: "Unicode", desc: "Full Unicode support" },
  { f: "y", label: "Sticky", desc: "Match from lastIndex only" },
];

interface CheatRow {
  token: string;
  desc: string;
}
interface CheatSection {
  title: string;
  rows: CheatRow[];
}

const CHEATSHEET: CheatSection[] = [
  {
    title: "Character classes",
    rows: [
      { token: ".", desc: "Any character except newline" },
      { token: "\\d \\D", desc: "Digit / non-digit" },
      { token: "\\w \\W", desc: "Word char / non-word char" },
      { token: "\\s \\S", desc: "Whitespace / non-whitespace" },
      { token: "[abc]", desc: "Any of a, b, or c" },
      { token: "[^abc]", desc: "Not a, b, or c" },
      { token: "[a-z]", desc: "Range a through z" },
    ],
  },
  {
    title: "Anchors",
    rows: [
      { token: "^", desc: "Start of string (or line with m)" },
      { token: "$", desc: "End of string (or line with m)" },
      { token: "\\b \\B", desc: "Word boundary / not boundary" },
    ],
  },
  {
    title: "Quantifiers",
    rows: [
      { token: "*", desc: "0 or more" },
      { token: "+", desc: "1 or more" },
      { token: "?", desc: "0 or 1 (optional)" },
      { token: "{n}", desc: "Exactly n times" },
      { token: "{n,}", desc: "n or more" },
      { token: "{n,m}", desc: "Between n and m" },
      { token: "*? +? ??", desc: "Lazy versions (shortest match)" },
    ],
  },
  {
    title: "Groups & alternation",
    rows: [
      { token: "(abc)", desc: "Capturing group" },
      { token: "(?:abc)", desc: "Non-capturing group" },
      { token: "(?<name>abc)", desc: "Named capture group" },
      { token: "a|b", desc: "Match a or b" },
      { token: "\\1 \\2", desc: "Backreference to group N" },
    ],
  },
  {
    title: "Lookaround",
    rows: [
      { token: "(?=abc)", desc: "Positive lookahead" },
      { token: "(?!abc)", desc: "Negative lookahead" },
      { token: "(?<=abc)", desc: "Positive lookbehind" },
      { token: "(?<!abc)", desc: "Negative lookbehind" },
    ],
  },
  {
    title: "Escapes",
    rows: [
      { token: "\\n \\r \\t", desc: "Newline, return, tab" },
      { token: "\\. \\* \\\\", desc: "Literal special chars" },
      { token: "\\uFFFF", desc: "Unicode codepoint" },
    ],
  },
];

interface Match {
  full: string;
  index: number;
  groups: string[];
  named: Record<string, string>;
}

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState(
    "Contact us at support@devkitx.dev or hello@example.com — both work.",
  );
  const [replacement, setReplacement] = useState("");

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null as RegExp | null, error: null as string | null };
    try {
      return { regex: new RegExp(pattern, flags), error: null };
    } catch (e) {
      return { regex: null, error: (e as Error).message };
    }
  }, [pattern, flags]);

  const matches: Match[] = useMemo(() => {
    if (!regex || !text) return [];
    const all: Match[] = [];
    if (regex.global || regex.sticky) {
      const r = new RegExp(regex.source, regex.flags);
      let m: RegExpExecArray | null;
      let safety = 0;
      while ((m = r.exec(text)) !== null && safety++ < 10000) {
        all.push({
          full: m[0],
          index: m.index,
          groups: m.slice(1),
          named: m.groups ?? {},
        });
        if (m[0] === "") r.lastIndex++; // avoid infinite loop on empty match
      }
    } else {
      const m = regex.exec(text);
      if (m) all.push({ full: m[0], index: m.index, groups: m.slice(1), named: m.groups ?? {} });
    }
    return all;
  }, [regex, text]);

  const highlighted = useMemo(() => {
    if (!matches.length) return <>{text}</>;
    const parts: React.ReactNode[] = [];
    let cur = 0;
    matches.forEach((m, i) => {
      if (m.index > cur) parts.push(<span key={`t-${i}`}>{text.slice(cur, m.index)}</span>);
      parts.push(
        <mark
          key={`m-${i}`}
          className="rounded bg-amber-200/70 px-0.5 text-foreground dark:bg-amber-500/30"
        >
          {m.full || "\u200B"}
        </mark>,
      );
      cur = m.index + m.full.length;
    });
    if (cur < text.length) parts.push(<span key="end">{text.slice(cur)}</span>);
    return <>{parts}</>;
  }, [matches, text]);

  const replaced = useMemo(() => {
    if (!regex) return "";
    try {
      return text.replace(regex, replacement);
    } catch {
      return "";
    }
  }, [regex, text, replacement]);

  const toggleFlag = (f: string) => {
    setFlags((cur) => (cur.includes(f) ? cur.replace(f, "") : cur + f));
  };

  return (
    <div className="space-y-4">
      {/* Pattern */}
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
          Regular expression
        </div>
        <div className="flex items-stretch font-mono text-sm">
          <span className="grid place-items-center border-r border-border bg-muted/30 px-3 text-muted-foreground">
            /
          </span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            spellCheck={false}
            placeholder="pattern"
            className="flex-1 bg-background px-3 py-2.5 outline-none"
          />
          <span className="grid place-items-center border-l border-r border-border bg-muted/30 px-3 text-muted-foreground">
            /
          </span>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
            spellCheck={false}
            placeholder="flags"
            className="w-24 bg-background px-3 py-2.5 outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 border-t border-border bg-muted/20 p-2">
          {FLAGS.map((f) => {
            const on = flags.includes(f.f);
            return (
              <button
                key={f.f}
                onClick={() => toggleFlag(f.f)}
                title={f.desc}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs font-medium transition-colors",
                  on
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-mono">{f.f}</span>
                <span className="ml-1.5 hidden sm:inline">{f.label}</span>
              </button>
            );
          })}
        </div>
        {error && (
          <div className="flex items-center gap-2 border-t border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 dark:text-rose-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            {error}
          </div>
        )}
      </div>

      {/* Test text + highlighted */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
            Test string
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            className="block h-56 w-full resize-y bg-background p-3 font-mono text-[12.5px] outline-none"
          />
        </div>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2 text-xs">
            <span className="font-medium text-muted-foreground">Matches</span>
            <span className="rounded bg-foreground px-1.5 py-0.5 font-mono text-[10px] text-background">
              {matches.length}
            </span>
          </div>
          <div className="h-56 overflow-auto whitespace-pre-wrap p-3 font-mono text-[12.5px] leading-relaxed">
            {highlighted}
          </div>
        </div>
      </div>

      {/* Match list */}
      {matches.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
            Match details
          </div>
          <ul className="divide-y divide-border">
            {matches.slice(0, 50).map((m, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-3 py-2 text-sm">
                <span className="font-mono text-xs text-muted-foreground">#{i + 1} @ {m.index}</span>
                <span className="font-mono text-foreground">{m.full || "(empty)"}</span>
                {m.groups.length > 0 && (
                  <span className="font-mono text-xs text-muted-foreground">
                    groups: [{m.groups.map((g) => JSON.stringify(g ?? null)).join(", ")}]
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Replace */}
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
          <span>Replace (use $1, $2, $&lt;name&gt; for groups)</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(replaced);
              toast.success("Result copied");
            }}
          >
            <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
          </Button>
        </div>
        <input
          value={replacement}
          onChange={(e) => setReplacement(e.target.value)}
          placeholder="Replacement string"
          className="block w-full border-b border-border bg-background px-3 py-2.5 font-mono text-sm outline-none"
        />
        <pre className="max-h-40 overflow-auto whitespace-pre-wrap p-3 font-mono text-[12.5px]">
          {replaced}
        </pre>
      </div>

      {/* Cheatsheet */}
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" />
          Regex cheatsheet
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {CHEATSHEET.map((section) => (
            <div key={section.title} className="bg-background p-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h4>
              <ul className="space-y-1.5">
                {section.rows.map((r) => (
                  <li key={r.token} className="flex items-baseline gap-2 text-sm">
                    <code className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                      {r.token}
                    </code>
                    <span className="text-muted-foreground">{r.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
