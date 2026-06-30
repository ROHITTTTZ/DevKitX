import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function JsonValidator() {
  return (
    <TextTransform
      live
      inputLabel="JSON"
      outputLabel="Result"
      placeholder='{"ok": true}'
      sample={`{"name":"stackscope","tools":40,"valid":true}`}
      transform={(s) => {
        JSON.parse(s);
        return "✓ Valid JSON";
      }}
    />
  );
}
