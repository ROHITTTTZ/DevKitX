import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "./json-formatter";

function uuidv4(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  const bytes = c.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const h = Array.from(bytes, (b: number) => b.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export default function UuidTool() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, uuidv4));
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const regen = () => {
    setUuids(Array.from({ length: Math.max(1, Math.min(1000, count)) }, uuidv4));
    toast.success(`Generated ${count} UUID${count > 1 ? "s" : ""}`);
  };

  const copy = async (v: string, i: number) => {
    await navigator.clipboard.writeText(v);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1200);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    toast.success("All UUIDs copied");
  };

  const download = () => {
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uuids.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="count" className="text-xs text-muted-foreground">
            Quantity
          </Label>
          <Input
            id="count"
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Number(e.target.value) || 1)}
            className="mt-1 w-28"
          />
        </div>
        <Button onClick={regen} className="rounded-xl">
          <RefreshCw className="h-4 w-4" /> Generate
        </Button>
        <Button onClick={copyAll} variant="outline" className="rounded-xl">
          <Copy className="h-4 w-4" /> Copy all
        </Button>
        <Button onClick={download} variant="outline" className="rounded-xl">
          <Download className="h-4 w-4" /> Download
        </Button>
      </div>

      <Panel title={`${uuids.length} UUID${uuids.length > 1 ? "s" : ""}`}>
        <ul className="max-h-[420px] divide-y divide-border overflow-auto">
          {uuids.map((u, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-2.5 group">
              <span className="text-xs tabular-nums text-muted-foreground w-8">{i + 1}</span>
              <code className="font-mono text-sm">{u}</code>
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copy(u, i)}
              >
                {copiedIdx === i ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
