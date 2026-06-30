import { useState } from "react";
import { faker } from "@faker-js/faker";
import { toast } from "sonner";
import { Check, Copy, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "./json-formatter";

function makeUser() {
  const first = faker.person.firstName();
  const last = faker.person.lastName();
  return {
    id: faker.string.uuid(),
    name: `${first} ${last}`,
    email: faker.internet.email({ firstName: first, lastName: last }).toLowerCase(),
    username: faker.internet.username({ firstName: first, lastName: last }).toLowerCase(),
    phone: faker.phone.number(),
    avatar: faker.image.avatarGitHub(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      zip: faker.location.zipCode(),
    },
    company: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
    createdAt: faker.date.past().toISOString(),
  };
}

export default function FakeUser() {
  const [count, setCount] = useState(5);
  const [data, setData] = useState(() => Array.from({ length: 5 }, makeUser));
  const [copied, setCopied] = useState(false);

  const generate = () => setData(Array.from({ length: count }, makeUser));
  const text = JSON.stringify(data, null, 2);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 1200);
  };
  const download = () => {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label className="text-xs">Count</Label>
          <Input
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(500, Number(e.target.value))))}
            className="mt-1 w-28"
          />
        </div>
        <Button onClick={generate} className="rounded-xl">
          <RefreshCw className="h-4 w-4" /> Generate
        </Button>
        <Button onClick={download} variant="outline" className="rounded-xl">
          <Download className="h-4 w-4" /> JSON
        </Button>
      </div>
      <Panel
        title={`Users (${data.length})`}
        action={
          <Button size="sm" variant="ghost" onClick={copy}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        }
      >
        <pre className="max-h-[520px] overflow-auto p-4 font-mono text-xs">{text}</pre>
      </Panel>
    </div>
  );
}
