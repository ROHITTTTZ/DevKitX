import { TextTransform } from "@/components/tool-kit/TextTransform";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else {
      if (c === '"') q = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else if (c === "\r") {/* skip */}
      else cur += c;
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

function formatCsv(text: string): string {
  const rows = parseCsv(text.trim());
  if (!rows.length) return "";
  const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => (r[i] ?? "").length)));
  return rows
    .map((r) => r.map((cell, i) => (cell ?? "").padEnd(widths[i])).join(" │ "))
    .join("\n");
}

export default function CsvFormatter() {
  return (
    <TextTransform
      inputLabel="CSV"
      outputLabel="Aligned table"
      placeholder="name,age,city"
      sample={`name,age,city\nAda,36,London\nLinus,54,Helsinki\nGrace,85,New York`}
      actionLabel="Format CSV"
      transform={formatCsv}
    />
  );
}
