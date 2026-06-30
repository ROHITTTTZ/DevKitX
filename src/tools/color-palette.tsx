import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "./json-formatter";

interface Color {
  h: number;
  s: number;
  l: number;
}

function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
}

function toHex({ r, g, b }: { r: number; g: number; b: number }) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function randomPalette(): Color[] {
  const baseHue = Math.floor(Math.random() * 360);
  return Array.from({ length: 5 }, (_, i) => ({
    h: (baseHue + i * 30) % 360,
    s: 55 + Math.floor(Math.random() * 25),
    l: 35 + i * 10,
  }));
}

export default function ColorPaletteTool() {
  const [palette, setPalette] = useState<Color[]>(randomPalette);

  const regen = useCallback(() => setPalette(randomPalette()), []);

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    toast.success(`${val} copied`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={regen} className="rounded-xl">
          <RefreshCw className="h-4 w-4" /> New palette
        </Button>
        <span className="text-xs text-muted-foreground self-center">
          Click a swatch to cycle copy format.
        </span>
      </div>

      <Panel title="Palette">
        <div className="grid grid-cols-1 sm:grid-cols-5">
          {palette.map((c, i) => {
            const rgb = hslToRgb(c.h, c.s, c.l);
            const hex = toHex(rgb);
            const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            const hslStr = `hsl(${c.h}, ${c.s}%, ${c.l}%)`;
            const dark = c.l < 50;
            return (
              <div
                key={i}
                className="group relative h-44 cursor-pointer transition-transform hover:z-10 hover:scale-[1.02]"
                style={{ background: hex }}
                onClick={() => copy(hex)}
              >
                <div
                  className={`absolute inset-x-0 bottom-0 p-3 text-xs font-mono ${dark ? "text-white" : "text-black"}`}
                >
                  <div className="font-semibold tracking-wide">{hex}</div>
                  <div className="opacity-70">{rgbStr}</div>
                  <div className="opacity-70">{hslStr}</div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`absolute right-2 top-2 opacity-0 group-hover:opacity-100 ${dark ? "text-white hover:bg-white/20" : "text-black hover:bg-black/10"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    copy(hex);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
