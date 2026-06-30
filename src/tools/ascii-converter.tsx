import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function AsciiConverter() {
  return (
    <TextTransform
      live
      inputLabel="Text"
      outputLabel="ASCII codes (decimal)"
      placeholder="Hello"
      sample={`Hello, DevKitX!`}
      transform={(s) =>
        Array.from(s)
          .map((c) => c.charCodeAt(0))
          .join(" ")
      }
    />
  );
}
