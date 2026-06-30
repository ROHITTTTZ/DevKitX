import { useMemo, useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type DiffOp = "eq" | "add" | "del";
interface DiffLine {
  op: DiffOp;
  leftNo: number | null;
  rightNo: number | null;
  text: string;
}

/** Classic LCS line-diff. O(n*m) — fine for typical paste sizes. */
function lineDiff(a: string[], b: string[]): DiffLine[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  let li = 1;
  let ri = 1;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ op: "eq", leftNo: li++, rightNo: ri++, text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ op: "del", leftNo: li++, rightNo: null, text: a[i] });
      i++;
    } else {
      out.push({ op: "add", leftNo: null, rightNo: ri++, text: b[j] });
      j++;
    }
  }
  while (i < n) out.push({ op: "del", leftNo: li++, rightNo: null, text: a[i++] });
  while (j < m) out.push({ op: "add", leftNo: null, rightNo: ri++, text: b[j++] });
  return out;
}

export default function DiffCheckerTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [ignoreWs, setIgnoreWs] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  const diff = useMemo(() => {
    const norm = (s: string) => {
      let v = s;
      if (ignoreWs) v = v.replace(/\s+/g, " ").trim();
      if (ignoreCase) v = v.toLowerCase();
      return v;
    };
    const la = left.split(/\r?\n/);
    const lb = right.split(/\r?\n/);
    const na = la.map(norm);
    const nb = lb.map(norm);
    // diff on normalized but display original
    const raw = lineDiff(na, nb);
    // Map back: walk both arrays in parallel
    let ai = 0;
    let bi = 0;
    return raw.map((row) => {
      if (row.op === "eq") return { ...row, text: la[ai++] ?? row.text, _b: bi++ };
      if (row.op === "del") return { ...row, text: la[ai++] ?? row.text };
      return { ...row, text: lb[bi++] ?? row.text };
    });
  }, [left, right, ignoreWs, ignoreCase]);

  const stats = useMemo(() => {
    let add = 0;
    let del = 0;
    for (const r of diff) {
      if (r.op === "add") add++;
      else if (r.op === "del") del++;
    }
    return { add, del, same: diff.length - add - del };
  }, [diff]);

  const swap = () => {
    setLeft(right);
    setRight(left);
  };

  const copyPatch = () => {
    const patch = diff
      .map((r) => (r.op === "add" ? `+ ${r.text}` : r.op === "del" ? `- ${r.text}` : `  ${r.text}`))
      .join("\n");
    navigator.clipboard.writeText(patch);
    toast.success("Patch copied");
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Pane label="Original" value={left} onChange={setLeft} />
        <Pane label="Changed" value={right} onChange={setRight} />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            checked={ignoreWs}
            onCheckedChange={(v) => setIgnoreWs(v === true)}
          />
          Ignore whitespace
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            checked={ignoreCase}
            onCheckedChange={(v) => setIgnoreCase(v === true)}
          />
          Ignore case
        </label>
        <Button size="sm" variant="outline" onClick={swap}>
          Swap sides
        </Button>
        <div className="ml-auto flex items-center gap-3 text-xs">
          <span className="rounded-md bg-emerald-500/10 px-2 py-1 font-medium text-emerald-600 dark:text-emerald-400">
            +{stats.add} added
          </span>
          <span className="rounded-md bg-rose-500/10 px-2 py-1 font-medium text-rose-600 dark:text-rose-400">
            −{stats.del} removed
          </span>
          <span className="text-muted-foreground">{stats.same} unchanged</span>
          <Button size="sm" variant="ghost" onClick={copyPatch}>
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copy patch
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <span>Side-by-side diff</span>
          <span>{diff.length} rows</span>
        </div>
        <div className="grid grid-cols-2 font-mono text-[12.5px]">
          {/* Left column */}
          <div className="border-r border-border">
            {diff.map((r, i) => (
              <Row
                key={`l-${i}`}
                no={r.leftNo}
                text={r.op === "add" ? "" : r.text}
                tone={r.op === "del" ? "del" : "eq"}
              />
            ))}
          </div>
          {/* Right column */}
          <div>
            {diff.map((r, i) => (
              <Row
                key={`r-${i}`}
                no={r.rightNo}
                text={r.op === "del" ? "" : r.text}
                tone={r.op === "add" ? "add" : "eq"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Pane({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2 text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <button
          onClick={() => onChange("")}
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Clear"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder={`Paste ${label.toLowerCase()} text…`}
        className="block h-64 w-full resize-y bg-background p-3 font-mono text-[12.5px] outline-none"
      />
    </div>
  );
}

function Row({
  no,
  text,
  tone,
}: {
  no: number | null;
  text: string;
  tone: "eq" | "add" | "del";
}) {
  return (
    <div
      className={cn(
        "flex min-h-[1.5rem] items-start gap-3 px-3 py-0.5",
        tone === "add" && "bg-emerald-500/10",
        tone === "del" && "bg-rose-500/10",
      )}
    >
      <span className="w-8 shrink-0 select-none text-right text-muted-foreground/60">
        {no ?? ""}
      </span>
      <span className="whitespace-pre-wrap break-all">{text || "\u00A0"}</span>
    </div>
  );
}
