import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "./json-formatter";

const TIMEZONES = ["UTC", Intl.DateTimeFormat().resolvedOptions().timeZone];

export default function TimestampTool() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const [unix, setUnix] = useState<string>(() => Math.floor(Date.now() / 1000).toString());
  const [iso, setIso] = useState<string>(() => new Date().toISOString().slice(0, 19));
  const [tz, setTz] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const fromUnix = useMemo(() => {
    const n = Number(unix);
    if (!Number.isFinite(n)) return null;
    const ms = unix.length > 10 ? n : n * 1000;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [unix]);

  const fromIso = useMemo(() => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [iso]);

  const fmt = (d: Date | null, zone: string) => {
    if (!d) return "—";
    try {
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: zone,
      }).format(d);
    } catch {
      return d.toString();
    }
  };

  const copy = (s: string) => {
    navigator.clipboard.writeText(s);
    toast.success("Copied");
  };

  return (
    <div className="space-y-4">
      <Panel title="Current time">
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          <Stat label="Unix (seconds)" value={Math.floor(now / 1000).toString()} onCopy={copy} />
          <Stat label="Unix (milliseconds)" value={now.toString()} onCopy={copy} />
          <Stat label="ISO 8601" value={new Date(now).toISOString()} onCopy={copy} />
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Unix → Human">
          <div className="space-y-4 p-5">
            <div>
              <Label className="text-xs text-muted-foreground">Unix timestamp</Label>
              <Input value={unix} onChange={(e) => setUnix(e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Timezone</Label>
              <select
                value={tz}
                onChange={(e) => setTz(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Array.from(new Set(TIMEZONES)).map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
              {fmt(fromUnix, tz)}
            </div>
          </div>
        </Panel>

        <Panel title="Human → Unix">
          <div className="space-y-4 p-5">
            <div>
              <Label className="text-xs text-muted-foreground">Date/time (ISO)</Label>
              <Input
                type="datetime-local"
                value={iso}
                onChange={(e) => setIso(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Stat
                label="Unix (sec)"
                value={fromIso ? Math.floor(fromIso.getTime() / 1000).toString() : "—"}
                onCopy={copy}
              />
              <Stat
                label="ISO 8601"
                value={fromIso ? fromIso.toISOString() : "—"}
                onCopy={copy}
              />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Stat({ label, value, onCopy }: { label: string; value: string; onCopy: (s: string) => void }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <Button size="sm" variant="ghost" onClick={() => onCopy(value)} disabled={value === "—"}>
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="mt-1 font-mono text-sm break-all">{value}</div>
    </div>
  );
}
