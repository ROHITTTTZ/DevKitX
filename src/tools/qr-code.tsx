import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Panel } from "./json-formatter";

export default function QrCodeTool() {
  const [text, setText] = useState("https://stackscope.dev");
  const [size, setSize] = useState(320);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, text || " ", {
      width: size,
      margin: 2,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    }).catch((e) => toast.error(e.message));
  }, [text, size]);

  const download = async () => {
    const url = await QRCode.toDataURL(text || " ", {
      width: size * 2,
      margin: 2,
    });
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,360px)]">
      <Panel title="Preview">
        <div className="flex items-center justify-center bg-muted/30 p-8">
          <div className="rounded-2xl bg-white p-4 shadow-elevated">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel title="Content">
          <div className="p-4 space-y-4">
            <div>
              <Label htmlFor="qr-text" className="text-xs text-muted-foreground">
                Text or URL
              </Label>
              <Input
                id="qr-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Size</Label>
                <span className="font-mono text-xs text-muted-foreground">{size}px</span>
              </div>
              <Slider
                value={[size]}
                min={120}
                max={640}
                step={20}
                onValueChange={(v) => setSize(v[0])}
                className="mt-3"
              />
            </div>
            <Button onClick={download} className="w-full rounded-xl">
              <Download className="h-4 w-4" /> Download PNG
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
