import { useState } from "react";
import { SignJWT } from "jose";
import { toast } from "sonner";
import { Check, Copy, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "./json-formatter";

export default function JwtGenerator() {
  const [payload, setPayload] = useState(`{\n  "sub": "1234567890",\n  "name": "Jane Doe"\n}`);
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [alg, setAlg] = useState("HS256");
  const [expires, setExpires] = useState("1h");
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);

  const sign = async () => {
    try {
      const data = JSON.parse(payload);
      const key = new TextEncoder().encode(secret);
      let signer = new SignJWT(data).setProtectedHeader({ alg }).setIssuedAt();
      if (expires.trim()) signer = signer.setExpirationTime(expires.trim());
      const jwt = await signer.sign(key);
      setToken(jwt);
      toast.success("JWT signed");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const copy = async () => {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Payload (JSON)">
          <Textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="min-h-[220px] resize-none border-0 bg-transparent font-mono text-sm focus-visible:ring-0"
          />
        </Panel>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Algorithm</Label>
            <select
              value={alg}
              onChange={(e) => setAlg(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option>HS256</option>
              <option>HS384</option>
              <option>HS512</option>
            </select>
          </div>
          <div>
            <Label className="text-xs">Secret</Label>
            <Input value={secret} onChange={(e) => setSecret(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Expires in (e.g. 1h, 2d)</Label>
            <Input value={expires} onChange={(e) => setExpires(e.target.value)} className="mt-1" />
          </div>
          <Button onClick={sign} className="rounded-xl">
            <Wand2 className="h-4 w-4" /> Sign JWT
          </Button>
        </div>
      </div>
      <Panel
        title="Token"
        action={
          <Button size="sm" variant="ghost" onClick={copy} disabled={!token}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        }
      >
        <pre className="min-h-[80px] overflow-auto p-4 font-mono text-sm break-all whitespace-pre-wrap">
          {token || <span className="text-muted-foreground">Token appears here.</span>}
        </pre>
      </Panel>
    </div>
  );
}
