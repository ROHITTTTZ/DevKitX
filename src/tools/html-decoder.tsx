import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function HtmlDecoder() {
  return (
    <TextTransform
      live
      inputLabel="Encoded HTML"
      outputLabel="Decoded text"
      placeholder="&lt;div&gt;Hi&lt;/div&gt;"
      sample={`&lt;div class=&quot;hero&quot;&gt;Tom &amp; Jerry&#39;s &quot;best&quot;&lt;/div&gt;`}
      transform={(s) => {
        const el = document.createElement("textarea");
        el.innerHTML = s;
        return el.value;
      }}
    />
  );
}
