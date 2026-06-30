import YAML from "yaml";
import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function YamlValidator() {
  return (
    <TextTransform
      live
      inputLabel="YAML"
      outputLabel="Result"
      placeholder="key: value"
      sample={`name: stackscope\ntools:\n  - json\n  - yaml`}
      transform={(s) => {
        YAML.parse(s);
        return "✓ Valid YAML";
      }}
    />
  );
}
