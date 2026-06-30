import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "./json-formatter";

function randHex() {
  const n = Math.floor(Math.random() * 0xffffff);
  return "#" + n.toString(16).padStart(6, "0");
}

export default function RandomColor() {
  const [count, setCount] = useState(12);
  const [colors, setColors] = useState<string[]>(() => Array.from({ length: 12 }, randHex));
  const [copied, setCopied] = useState<string | null>(null);

  const generate = () => setColors(Array.from({ length: count }, randHex));
  const copy = async (c: string) => {
    await navigator.clipboard.writeText(c);
    setCopied(c);
    toast.success("Copied " + c);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label className="text-xs">Count</Label>
          <Input type="number" min={1} max={64} value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-1 w-28" />
        </div>
        <Button onClick={generate} className="rounded-xl">
          <RefreshCw className="h-4 w-4" /> Generate
        </Button>
      </div>
      <Panel title="Random colors">
        <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 md:grid-cols-4">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => copy(c)}
              className="group flex items-center gap-3 rounded-xl border border-border bg-background p-2 text-left transition hover:shadow-sm"
            >
              <span className="h-10 w-10 rounded-lg border border-border" style={{ background: c }} />
              <span className="flex-1 font-mono text-xs">{c}</span>
              {copied === c ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100" />}
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
