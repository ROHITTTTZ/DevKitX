import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function UnicodeConverter() {
  return (
    <TextTransform
      live
      inputLabel="Text"
      outputLabel="Unicode escapes"
      placeholder="Hello 世界 🌍"
      sample={`Hello 世界 🌍`}
      transform={(s) =>
        Array.from(s)
          .map((ch) => {
            const cp = ch.codePointAt(0)!;
            return cp > 0x7f ? "\\u" + cp.toString(16).padStart(4, "0") : ch;
          })
          .join("")
      }
    />
  );
}
