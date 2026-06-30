import slugify from "slugify";
import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function SlugGenerator() {
  return (
    <TextTransform
      live
      inputLabel="Text"
      outputLabel="URL slug"
      placeholder="My Awesome Article Title!"
      sample={`10 Tips for Building Better Developer Tools (in 2026)`}
      transform={(s) =>
        s
          .split("\n")
          .map((line) => slugify(line, { lower: true, strict: true, trim: true }))
          .join("\n")
      }
    />
  );
}
