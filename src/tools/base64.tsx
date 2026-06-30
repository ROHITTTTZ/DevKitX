import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeftRight, Check, Copy, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Panel } from "./json-formatter";

export default function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const run = () => {
    try {
      if (mode === "encode") {
        const bytes = new TextEncoder().encode(input);
        let bin = "";
        bytes.forEach((b) => (bin += String.fromCharCode(b)));
        setOutput(btoa(bin));
      } else {
        const bin = atob(input.trim());
        const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
        setOutput(new TextDecoder().decode(bytes));
      }
    } catch (e) {
      toast.error("Failed: " + (e as Error).message);
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    setInput(output);
    setOutput(input);
    setMode((m) => (m === "encode" ? "decode" : "encode"));
  };

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(v) => setMode(v as "encode" | "decode")}>
        <TabsList>
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>
        <TabsContent value={mode} className="mt-4 grid gap-4 lg:grid-cols-2">
          <Panel
            title={mode === "encode" ? "Plain text" : "Base64 input"}
            action={
              <Button size="sm" variant="ghost" onClick={() => setInput("")}>
                <Eraser className="h-3.5 w-3.5" /> Clear
              </Button>
            }
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[280px] resize-none border-0 bg-transparent font-mono text-sm focus-visible:ring-0"
              placeholder={mode === "encode" ? "Type or paste text…" : "Paste Base64 string…"}
            />
          </Panel>
          <Panel
            title="Result"
            action={
              <Button size="sm" variant="ghost" onClick={copy} disabled={!output}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            }
          >
            <pre className="min-h-[280px] overflow-auto p-4 font-mono text-sm break-all whitespace-pre-wrap">
              {output || <span className="text-muted-foreground">Output appears here.</span>}
            </pre>
          </Panel>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap gap-2">
        <Button onClick={run} className="rounded-xl">
          {mode === "encode" ? "Encode" : "Decode"}
        </Button>
        <Button onClick={swap} variant="outline" className="rounded-xl">
          <ArrowLeftRight className="h-4 w-4" /> Swap
        </Button>
      </div>
    </div>
  );
}
