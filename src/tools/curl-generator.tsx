import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Panel } from "./json-formatter";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export default function CurlGenerator() {
  const [url, setUrl] = useState("https://api.stackscope.dev/v1/users");
  const [method, setMethod] = useState("POST");
  const [headers, setHeaders] = useState<[string, string][]>([
    ["Content-Type", "application/json"],
    ["Authorization", "Bearer YOUR_TOKEN"],
  ]);
  const [body, setBody] = useState(`{\n  "name": "Ada"\n}`);
  const [copied, setCopied] = useState(false);

  const cmd = useMemo(() => {
    const lines: string[] = [`curl -X ${method} '${url}'`];
    headers.filter(([k]) => k.trim()).forEach(([k, v]) => lines.push(`  -H '${k}: ${v}'`));
    if (method !== "GET" && body.trim()) lines.push(`  -d '${body.replace(/'/g, "'\\''")}'`);
    return lines.join(" \\\n");
  }, [url, method, headers, body]);

  const copy = async () => {
    await navigator.clipboard.writeText(cmd);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
        <div>
          <Label className="text-xs">Method</Label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {METHODS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <Label className="text-xs">URL</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} className="mt-1 font-mono" />
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <Label className="text-xs">Headers</Label>
          <Button size="sm" variant="ghost" onClick={() => setHeaders([...headers, ["", ""]])}>
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {headers.map(([k, v], i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <Input value={k} onChange={(e) => { const h=[...headers]; h[i]=[e.target.value,v]; setHeaders(h); }} placeholder="Name" className="font-mono text-xs" />
              <Input value={v} onChange={(e) => { const h=[...headers]; h[i]=[k,e.target.value]; setHeaders(h); }} placeholder="Value" className="font-mono text-xs" />
              <Button size="sm" variant="ghost" onClick={() => setHeaders(headers.filter((_,j) => j!==i))}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {method !== "GET" && (
        <div>
          <Label className="text-xs">Body</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="mt-1 min-h-[120px] font-mono text-xs" />
        </div>
      )}

      <Panel
        title="curl command"
        action={
          <Button size="sm" variant="ghost" onClick={copy}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        }
      >
        <pre className="overflow-auto p-4 font-mono text-xs whitespace-pre-wrap break-all">{cmd}</pre>
      </Panel>
    </div>
  );
}
