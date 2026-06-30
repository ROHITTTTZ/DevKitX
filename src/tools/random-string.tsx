import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Panel } from "./json-formatter";

export default function RandomString() {
  const [length, setLength] = useState(32);
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [values, setValues] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = () => {
    let alpha = "";
    if (upper) alpha += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) alpha += "abcdefghijklmnopqrstuvwxyz";
    if (digits) alpha += "0123456789";
    if (symbols) alpha += "!@#$%^&*()-_=+[]{};:,.<>?";
    if (!alpha) return toast.error("Pick at least one charset");
    const arr: string[] = [];
    for (let i = 0; i < count; i++) {
      const buf = new Uint8Array(length);
      crypto.getRandomValues(buf);
      arr.push(Array.from(buf, (b) => alpha[b % alpha.length]).join(""));
    }
    setValues(arr);
  };

  const copy = async (v: string) => {
    await navigator.clipboard.writeText(v);
    setCopied(v);
    toast.success("Copied");
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label className="text-xs">Length</Label>
          <Input type="number" min={1} max={1024} value={length} onChange={(e) => setLength(Number(e.target.value))} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Count</Label>
          <Input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-1" />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><Checkbox checked={upper} onCheckedChange={(v) => setUpper(!!v)} /> Uppercase</label>
        <label className="flex items-center gap-2"><Checkbox checked={lower} onCheckedChange={(v) => setLower(!!v)} /> Lowercase</label>
        <label className="flex items-center gap-2"><Checkbox checked={digits} onCheckedChange={(v) => setDigits(!!v)} /> Digits</label>
        <label className="flex items-center gap-2"><Checkbox checked={symbols} onCheckedChange={(v) => setSymbols(!!v)} /> Symbols</label>
      </div>
      <Button onClick={generate} className="rounded-xl">
        <RefreshCw className="h-4 w-4" /> Generate
      </Button>
      {values.length > 0 && (
        <Panel title="Strings">
          <ul className="divide-y divide-border">
            {values.map((v) => (
              <li key={v} className="flex items-center justify-between gap-2 px-4 py-2 font-mono text-xs">
                <span className="truncate">{v}</span>
                <Button size="sm" variant="ghost" onClick={() => copy(v)}>
                  {copied === v ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
