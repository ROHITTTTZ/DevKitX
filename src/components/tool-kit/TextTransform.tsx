import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Eraser, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Panel } from "@/tools/json-formatter";

export interface TextTransformProps {
  inputLabel?: string;
  outputLabel?: string;
  placeholder?: string;
  sample?: string;
  actionLabel?: string;
  /** Pure function: throws Error on failure. */
  transform: (input: string) => string;
  /** When true, runs transform live as the user types. */
  live?: boolean;
  minHeight?: number;
}

export function TextTransform({
  inputLabel = "Input",
  outputLabel = "Output",
  placeholder = "Paste content here…",
  sample = "",
  actionLabel = "Run",
  transform,
  live = false,
  minHeight = 320,
}: TextTransformProps) {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const liveResult = useMemo(() => {
    if (!live) return null;
    if (!input.trim()) return { ok: true, out: "" };
    try {
      return { ok: true, out: transform(input) };
    } catch (e) {
      return { ok: false, err: (e as Error).message };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, live]);

  const display = live ? (liveResult?.ok ? (liveResult as { ok: true; out: string }).out : "") : output;
  const liveErr = live && liveResult && !liveResult.ok ? (liveResult as { ok: false; err: string }).err : null;

  const run = () => {
    try {
      setOutput(transform(input));
      setErr(null);
    } catch (e) {
      setErr((e as Error).message);
      toast.error((e as Error).message);
    }
  };

  const copy = async () => {
    if (!display) return;
    await navigator.clipboard.writeText(display);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 1200);
  };

  const activeErr = liveErr ?? err;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title={inputLabel}
          action={
            <Button size="sm" variant="ghost" onClick={() => setInput("")}>
              <Eraser className="h-3.5 w-3.5" /> Clear
            </Button>
          }
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="resize-none border-0 bg-transparent font-mono text-sm focus-visible:ring-0"
            style={{ minHeight }}
            placeholder={placeholder}
          />
          {activeErr && (
            <div className="border-t border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive">
              {activeErr}
            </div>
          )}
        </Panel>
        <Panel
          title={outputLabel}
          action={
            <Button size="sm" variant="ghost" onClick={copy} disabled={!display}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          }
        >
          <pre
            className="overflow-auto p-4 font-mono text-sm whitespace-pre-wrap break-words"
            style={{ minHeight }}
          >
            {display || <span className="text-muted-foreground">Result appears here.</span>}
          </pre>
        </Panel>
      </div>
      {!live && (
        <Button onClick={run} className="rounded-xl">
          <Wand2 className="h-4 w-4" /> {actionLabel}
        </Button>
      )}
    </div>
  );
}
