import YAML from "yaml";
import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function YamlFormatter() {
  return (
    <TextTransform
      inputLabel="YAML"
      outputLabel="Formatted YAML"
      placeholder="name: stackscope"
      sample={`name: stackscope\nversion: 1\ntools:\n  - json\n  - yaml\n  - sql`}
      actionLabel="Format YAML"
      transform={(s) => YAML.stringify(YAML.parse(s), { indent: 2 })}
    />
  );
}
