import { useMemo, useState } from "react";
import { marked } from "marked";
import { toast } from "sonner";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Panel } from "./json-formatter";

const SAMPLE = `# DevKitX

A premium collection of **developer tools** built for speed and beauty.

## Features
- ⚡ Instant feedback
- 🔒 100% client-side
- 🎨 Beautifully crafted UI

> Ship faster. Look better.

\`\`\`ts
const greet = (name: string) => \`Hello, \${name}!\`;
\`\`\`
`;

export default function MarkdownTool() {
  const [md, setMd] = useState(SAMPLE);
  const html = useMemo(() => marked.parse(md, { async: false }) as string, [md]);

  const copyMd = () => {
    navigator.clipboard.writeText(md);
    toast.success("Markdown copied");
  };
  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    toast.success("HTML copied");
  };
  const download = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Markdown"
          action={
            <Button size="sm" variant="ghost" onClick={copyMd}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
          }
        >
          <Textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            className="min-h-[420px] resize-none border-0 bg-transparent font-mono text-sm focus-visible:ring-0"
          />
        </Panel>
        <Panel
          title="Preview"
          action={
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={copyHtml}>
                <Copy className="h-3.5 w-3.5" /> HTML
              </Button>
              <Button size="sm" variant="ghost" onClick={download}>
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          }
        >
          <div
            className="prose-md min-h-[420px] overflow-auto p-5 text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Panel>
      </div>
      <style>{`
        .prose-md h1 { font-size: 1.75rem; font-weight: 700; margin: 0.5rem 0 1rem; letter-spacing: -0.02em; }
        .prose-md h2 { font-size: 1.35rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
        .prose-md h3 { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.5rem; }
        .prose-md p  { margin: 0.5rem 0; line-height: 1.65; color: var(--color-foreground); }
        .prose-md ul, .prose-md ol { margin: 0.5rem 0 0.5rem 1.25rem; }
        .prose-md li { margin: 0.25rem 0; }
        .prose-md code { font-family: var(--font-mono); background: var(--color-muted); padding: 0.1rem 0.35rem; border-radius: 0.3rem; font-size: 0.85em; }
        .prose-md pre { background: var(--color-muted); padding: 1rem; border-radius: 0.75rem; overflow: auto; margin: 0.75rem 0; }
        .prose-md pre code { background: transparent; padding: 0; }
        .prose-md blockquote { border-left: 3px solid var(--color-brand); padding-left: 1rem; color: var(--color-muted-foreground); margin: 0.75rem 0; }
        .prose-md a { color: var(--color-brand); text-decoration: underline; text-underline-offset: 3px; }
        .prose-md hr { border-color: var(--color-border); margin: 1.5rem 0; }
      `}</style>
    </div>
  );
}
