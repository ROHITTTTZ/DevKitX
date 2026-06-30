import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Panel } from "./json-formatter";

export default function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(10);
  const [unique, setUnique] = useState(false);
  const [out, setOut] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (max < min) return toast.error("Max must be ≥ min");
    if (unique && max - min + 1 < count) return toast.error("Range too small for unique values");
    const result: number[] = [];
    const seen = new Set<number>();
    while (result.length < count) {
      const n = Math.floor(Math.random() * (max - min + 1)) + min;
      if (unique) {
        if (seen.has(n)) continue;
        seen.add(n);
      }
      result.push(n);
    }
    setOut(result);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(out.join(", "));
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label className="text-xs">Min</Label>
          <Input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Max</Label>
          <Input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Count</Label>
          <Input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-1" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={unique} onCheckedChange={(v) => setUnique(!!v)} /> Unique values
      </label>
      <Button onClick={generate} className="rounded-xl">
        <RefreshCw className="h-4 w-4" /> Generate
      </Button>
      {out.length > 0 && (
        <Panel
          title="Numbers"
          action={
            <Button size="sm" variant="ghost" onClick={copy}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          }
        >
          <div className="flex flex-wrap gap-2 p-4 font-mono text-sm">
            {out.map((n, i) => (
              <span key={i} className="rounded-md border border-border bg-muted/40 px-2 py-0.5">{n}</span>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
