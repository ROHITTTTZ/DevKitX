import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Panel } from "./json-formatter";
import { cn } from "@/lib/utils";

const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/",
};

function generate(opts: {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
}): string {
  let charset = "";
  if (opts.upper) charset += SETS.upper;
  if (opts.lower) charset += SETS.lower;
  if (opts.numbers) charset += SETS.numbers;
  if (opts.symbols) charset += SETS.symbols;
  if (!charset) return "";
  const arr = new Uint32Array(opts.length);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < opts.length; i++) out += charset[arr[i] % charset.length];
  return out;
}

function strength(pw: string): { score: number; label: string; color: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (pw.length >= 16) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: "Weak", color: "bg-destructive" },
    { label: "Weak", color: "bg-destructive" },
    { label: "Fair", color: "bg-yellow-500" },
    { label: "Good", color: "bg-yellow-400" },
    { label: "Strong", color: "bg-brand" },
    { label: "Strong", color: "bg-brand" },
    { label: "Excellent", color: "bg-brand" },
  ];
  return { score: Math.min(s, 6), ...map[Math.min(s, 6)] };
}

export default function PasswordTool() {
  const [length, setLength] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [pw, setPw] = useState(() => generate({ length: 20, upper: true, lower: true, numbers: true, symbols: true }));
  const [copied, setCopied] = useState(false);

  const regen = () => setPw(generate({ length, upper, lower, numbers, symbols }));

  const meter = useMemo(() => strength(pw), [pw]);

  const copy = async () => {
    if (!pw) return;
    await navigator.clipboard.writeText(pw);
    setCopied(true);
    toast.success("Password copied");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <Panel title="Generated password">
        <div className="p-5">
          <div className="font-mono text-lg sm:text-2xl break-all">
            {pw || <span className="text-muted-foreground">Select at least one set</span>}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full transition-all", meter.color)}
                style={{ width: `${(meter.score / 6) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground w-20 text-right">
              {meter.label}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={regen} className="rounded-xl">
              <RefreshCw className="h-4 w-4" /> Regenerate
            </Button>
            <Button onClick={copy} variant="outline" className="rounded-xl">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </Panel>

      <Panel title="Options">
        <div className="space-y-5 p-5">
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Length</Label>
              <span className="font-mono text-sm text-muted-foreground">{length}</span>
            </div>
            <Slider
              value={[length]}
              min={4}
              max={64}
              step={1}
              onValueChange={(v) => setLength(v[0])}
              className="mt-3"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle label="Uppercase (A–Z)" checked={upper} onCheckedChange={setUpper} />
            <Toggle label="Lowercase (a–z)" checked={lower} onCheckedChange={setLower} />
            <Toggle label="Numbers (0–9)" checked={numbers} onCheckedChange={setNumbers} />
            <Toggle label="Symbols (!@#…)" checked={symbols} onCheckedChange={setSymbols} />
          </div>
        </div>
      </Panel>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 cursor-pointer">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}
