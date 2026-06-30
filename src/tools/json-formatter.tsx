import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Download, Eraser, FileJson, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function JsonFormatter() {
  const [input, setInput] = useState<string>(SAMPLE);
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const validity = useMemo(() => {
    if (!input.trim()) return { ok: true, error: null as string | null };
    try {
      JSON.parse(input);
      return { ok: true, error: null };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  }, [input]);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      toast.success("JSON formatted");
    } catch (e) {
      toast.error("Invalid JSON: " + (e as Error).message);
    }
  };
  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      toast.success("JSON minified");
    } catch (e) {
      toast.error("Invalid JSON");
    }
  };
  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 1500);
  };
  const download = () => {
    const blob = new Blob([output || input], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel
        title="Input"
        action={
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => setInput("")}>
              <Eraser className="h-3.5 w-3.5" /> Clear
            </Button>
          </div>
        }
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[360px] resize-none border-0 bg-transparent font-mono text-sm focus-visible:ring-0"
          placeholder='{"name": "stackscope"}'
        />
        {!validity.ok && (
          <div className="border-t border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive">
            {validity.error}
          </div>
        )}
      </Panel>

      <Panel
        title="Output"
        action={
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={copy} disabled={!output}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button size="sm" variant="ghost" onClick={download} disabled={!output}>
              <Download className="h-3.5 w-3.5" />
            </Button>
          </div>
        }
      >
        <pre className="min-h-[360px] overflow-auto p-4 font-mono text-sm">
          <code>{output || <span className="text-muted-foreground">Format JSON to see output here.</span>}</code>
        </pre>
      </Panel>

      <div className="lg:col-span-2 flex flex-wrap gap-2">
        <Button onClick={format} className="rounded-xl">
          <Wand2 className="h-4 w-4" /> Beautify
        </Button>
        <Button onClick={minify} variant="outline" className="rounded-xl">
          <FileJson className="h-4 w-4" /> Minify
        </Button>
      </div>
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

const SAMPLE = `{
  "project": "DevKitX",
  "tools": 10,
  "tags": ["json", "uuid", "qr"]
}`;
