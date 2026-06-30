import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "./json-formatter";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function genKey(length: number, prefix: string) {
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  const body = Array.from(buf, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return prefix ? `${prefix}_${body}` : body;
}

export default function ApiKeyGenerator() {
  const [prefix, setPrefix] = useState("sk_live");
  const [length, setLength] = useState(40);
  const [count, setCount] = useState(5);
  const [keys, setKeys] = useState<string[]>(() =>
    Array.from({ length: 5 }, () => genKey(40, "sk_live")),
  );
  const [copied, setCopied] = useState<string | null>(null);

  const generate = () => setKeys(Array.from({ length: count }, () => genKey(length, prefix)));
  const copy = async (k: string) => {
    await navigator.clipboard.writeText(k);
    setCopied(k);
    toast.success("Copied");
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <Label className="text-xs">Prefix</Label>
          <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Length</Label>
          <Input
            type="number"
            min={8}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Count</Label>
          <Input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={generate} className="w-full rounded-xl">
            <RefreshCw className="h-4 w-4" /> Generate
          </Button>
        </div>
      </div>
      <Panel title="API keys">
        <ul className="divide-y divide-border">
          {keys.map((k) => (
            <li key={k} className="flex items-center justify-between gap-2 px-4 py-2 font-mono text-xs">
              <span className="truncate">{k}</span>
              <Button size="sm" variant="ghost" onClick={() => copy(k)}>
                {copied === k ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
