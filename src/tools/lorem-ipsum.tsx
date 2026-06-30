import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "./json-formatter";

const WORDS = `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum`.split(" ");

function sentence(min = 6, max = 16) {
  const n = min + Math.floor(Math.random() * (max - min));
  const words = Array.from({ length: n }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}
function paragraph() {
  const n = 4 + Math.floor(Math.random() * 4);
  return Array.from({ length: n }, () => sentence()).join(" ");
}

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [out, setOut] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let text = "";
    if (unit === "paragraphs") text = Array.from({ length: count }, paragraph).join("\n\n");
    else if (unit === "sentences") text = Array.from({ length: count }, () => sentence()).join(" ");
    else text = Array.from({ length: count }, () => WORDS[Math.floor(Math.random() * WORDS.length)]).join(" ");
    setOut(text);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(out);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label className="text-xs">Count</Label>
          <Input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-28"
          />
        </div>
        <div>
          <Label className="text-xs">Unit</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as typeof unit)}
            className="mt-1 block rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <Button onClick={generate} className="rounded-xl">
          <RefreshCw className="h-4 w-4" /> Generate
        </Button>
      </div>
      <Panel
        title="Lorem ipsum"
        action={
          <Button size="sm" variant="ghost" onClick={copy} disabled={!out}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        }
      >
        <pre className="min-h-[280px] whitespace-pre-wrap p-4 font-sans text-sm leading-relaxed">
          {out || <span className="text-muted-foreground">Click generate to create placeholder text.</span>}
        </pre>
      </Panel>
    </div>
  );
}
