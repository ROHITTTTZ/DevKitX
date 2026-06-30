import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function HtmlValidator() {
  return (
    <TextTransform
      live
      inputLabel="HTML"
      outputLabel="Result"
      placeholder="<div>Hello</div>"
      sample={`<html><body><h1>Hi</h1><p>Demo</p></body></html>`}
      transform={(s) => {
        const doc = new DOMParser().parseFromString(s, "text/html");
        const err = doc.querySelector("parsererror");
        if (err) throw new Error(err.textContent || "Invalid HTML");
        const issues: string[] = [];
        const opens = (s.match(/<([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(?<!\/)>/g) || []).length;
        const closes = (s.match(/<\/[a-zA-Z][a-zA-Z0-9-]*\s*>/g) || []).length;
        const voids = (s.match(/<(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)\b[^>]*>/gi) || []).length;
        if (opens - voids !== closes)
          issues.push(`Possible tag mismatch: ${opens - voids} open vs ${closes} close.`);
        return issues.length ? "⚠ " + issues.join(" ") : "✓ Well-formed HTML";
      }}
    />
  );
}
