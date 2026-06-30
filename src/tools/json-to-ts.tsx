import { TextTransform } from "@/components/tool-kit/TextTransform";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

const RESERVED = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
function key(k: string) {
  return RESERVED.test(k) ? k : JSON.stringify(k);
}
function pascal(s: string) {
  return s.replace(/(^|[_\- ])(\w)/g, (_, __, c) => c.toUpperCase()).replace(/\W/g, "") || "Root";
}

function typeOf(v: Json): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function mergeObjects(arr: Record<string, Json>[]): Record<string, Json[]> {
  const out: Record<string, Json[]> = {};
  for (const o of arr) for (const k of Object.keys(o)) (out[k] ||= []).push(o[k]);
  return out;
}

function render(name: string, value: Json, interfaces: Map<string, string>): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const allObj = value.every((v) => v && typeof v === "object" && !Array.isArray(v));
    if (allObj) {
      const merged = mergeObjects(value as Record<string, Json>[]);
      const fields = Object.entries(merged).map(([k, vs]) => {
        const t = unionTypes(vs, pascal(k), interfaces);
        return `  ${key(k)}: ${t};`;
      });
      const iname = pascal(name);
      interfaces.set(iname, `export interface ${iname} {\n${fields.join("\n")}\n}`);
      return `${iname}[]`;
    }
    const inner = unionTypes(value, name, interfaces);
    return `${inner}[]`;
  }
  if (value && typeof value === "object") {
    const fields = Object.entries(value).map(([k, v]) => {
      const t = render(pascal(k), v, interfaces);
      return `  ${key(k)}: ${t};`;
    });
    const iname = pascal(name);
    interfaces.set(iname, `export interface ${iname} {\n${fields.join("\n")}\n}`);
    return iname;
  }
  const t = typeOf(value);
  if (t === "null") return "null";
  return t;
}

function unionTypes(values: Json[], name: string, interfaces: Map<string, string>): string {
  const set = new Set<string>();
  for (const v of values) set.add(render(name, v, interfaces));
  return Array.from(set).join(" | ") || "unknown";
}

function jsonToTs(src: string): string {
  const data = JSON.parse(src);
  const interfaces = new Map<string, string>();
  const root = render("Root", data, interfaces);
  const parts = Array.from(interfaces.values());
  if (!interfaces.has(root) && /^[A-Z]/.test(root) === false) {
    parts.unshift(`export type Root = ${root};`);
  }
  return parts.join("\n\n");
}

export default function JsonToTs() {
  return (
    <TextTransform
      live
      inputLabel="JSON"
      outputLabel="TypeScript interface"
      placeholder='{"id":1,"name":"Ada"}'
      sample={`{\n  "id": 1,\n  "name": "Ada",\n  "active": true,\n  "tags": ["admin","beta"],\n  "address": {\n    "city": "London",\n    "zip": "EC1"\n  },\n  "posts": [\n    { "id": 1, "title": "Hello" },\n    { "id": 2, "title": "World", "pinned": true }\n  ]\n}`}
      transform={jsonToTs}
    />
  );
}
