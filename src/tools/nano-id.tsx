import { useState } from "react";
import { nanoid, customAlphabet } from "nanoid";
import { toast } from "sonner";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "./json-formatter";

export default function NanoIdGenerator() {
  const [size, setSize] = useState(21);
  const [count, setCount] = useState(10);
  const [alphabet, setAlphabet] = useState("");
  const [ids, setIds] = useState<string[]>(() => Array.from({ length: 10 }, () => nanoid(21)));
  const [copied, setCopied] = useState<string | null>(null);

  const generate = () => {
    const gen = alphabet.trim() ? customAlphabet(alphabet.trim(), size) : () => nanoid(size);
    setIds(Array.from({ length: count }, () => gen()));
  };
  const copy = async (v: string) => {
    await navigator.clipboard.writeText(v);
    setCopied(v);
    toast.success("Copied");
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <Label className="text-xs">Size</Label>
          <Input type="number" min={4} max={64} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Count</Label>
          <Input type="number" min={1} max={500} value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs">Custom alphabet (optional)</Label>
          <Input value={alphabet} onChange={(e) => setAlphabet(e.target.value)} placeholder="abcdef0123456789" className="mt-1" />
        </div>
      </div>
      <Button onClick={generate} className="rounded-xl">
        <RefreshCw className="h-4 w-4" /> Generate
      </Button>
      <Panel title={`Nano IDs (${ids.length})`}>
        <ul className="divide-y divide-border">
          {ids.map((v) => (
            <li key={v} className="flex items-center justify-between gap-2 px-4 py-2 font-mono text-xs">
              <span className="truncate">{v}</span>
              <Button size="sm" variant="ghost" onClick={() => copy(v)}>
                {copied === v ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
