import beautify from "js-beautify";
import { TextTransform } from "@/components/tool-kit/TextTransform";
const beautifyHtml = beautify.html;

export default function HtmlFormatter() {
  return (
    <TextTransform
      inputLabel="HTML"
      outputLabel="Formatted HTML"
      placeholder="<div><p>Hello</p></div>"
      sample={`<html><head><title>Demo</title></head><body><h1>Hi</h1><p>DevKitX.</p></body></html>`}
      actionLabel="Format HTML"
      transform={(s) =>
        beautifyHtml(s, { indent_size: 2, wrap_line_length: 0, end_with_newline: true })
      }
    />
  );
}
