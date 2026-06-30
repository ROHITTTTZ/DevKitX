import { css as beautifyCss } from "js-beautify";
import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function CssFormatter() {
  return (
    <TextTransform
      inputLabel="CSS"
      outputLabel="Formatted CSS"
      placeholder=".btn{color:red;background:#fff}"
      sample={`body{margin:0;font-family:Inter,sans-serif}.btn{color:#fff;background:#111;padding:8px 16px;border-radius:8px}`}
      actionLabel="Format CSS"
      transform={(s) => beautifyCss(s, { indent_size: 2, end_with_newline: true })}
    />
  );
}
