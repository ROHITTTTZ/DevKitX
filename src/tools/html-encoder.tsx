import { TextTransform } from "@/components/tool-kit/TextTransform";

const MAP: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export default function HtmlEncoder() {
  return (
    <TextTransform
      live
      inputLabel="Text / HTML"
      outputLabel="Encoded entities"
      placeholder="<div>Hello & world</div>"
      sample={`<div class="hero">Tom & Jerry's "best" episodes</div>`}
      transform={(s) => s.replace(/[&<>"']/g, (c) => MAP[c])}
    />
  );
}
