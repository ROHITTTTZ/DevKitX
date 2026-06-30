import { useMemo, useState } from "react";
import CryptoJS from "crypto-js";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Panel } from "./json-formatter";

const ALGOS = ["MD5", "SHA-1", "SHA-256", "SHA-512"] as const;

export default function HashTool() {
  const [input, setInput] = useState("hello world");

  const hashes = useMemo(() => {
    const w = CryptoJS.enc.Utf8.parse(input);
    return {
      "MD5": CryptoJS.MD5(w).toString(),
      "SHA-1": CryptoJS.SHA1(w).toString(),
      "SHA-256": CryptoJS.SHA256(w).toString(),
      "SHA-512": CryptoJS.SHA512(w).toString(),
    } as Record<(typeof ALGOS)[number], string>;
  }, [input]);

  const copy = (s: string, label: string) => {
    navigator.clipboard.writeText(s);
    toast.success(`${label} copied`);
  };

  return (
    <div className="space-y-4">
      <Panel title="Input">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type anything…"
          className="min-h-[140px] resize-none border-0 bg-transparent font-mono text-sm focus-visible:ring-0"
        />
      </Panel>

      <div className="grid gap-3">
        {ALGOS.map((a) => (
          <div
            key={a}
            className="grid grid-cols-[80px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-brand">{a}</div>
            <code className="truncate font-mono text-sm">{hashes[a]}</code>
            <Button size="sm" variant="ghost" onClick={() => copy(hashes[a], a)}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
