import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function CssValidator() {
  return (
    <TextTransform
      live
      inputLabel="CSS"
      outputLabel="Result"
      placeholder=".btn { color: red; }"
      sample={`.btn { color: #fff; background: #111; padding: 8px 16px; }`}
      transform={(s) => {
        let depth = 0;
        for (const c of s) {
          if (c === "{") depth++;
          else if (c === "}") depth--;
          if (depth < 0) throw new Error("Unexpected '}' — unbalanced braces");
        }
        if (depth !== 0) throw new Error(`Unbalanced braces (${depth > 0 ? "missing }" : "extra }"})`);
        const sheet = new CSSStyleSheet();
        try { sheet.replaceSync(s); } catch (e) { throw new Error((e as Error).message); }
        return `✓ Valid CSS — ${sheet.cssRules.length} rule(s)`;
      }}
    />
  );
}
