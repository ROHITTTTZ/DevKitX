import { TextTransform } from "@/components/tool-kit/TextTransform";
import { toNode } from "@/lib/curl-parse";

export default function CurlToNode() {
  return (
    <TextTransform
      live
      inputLabel="curl command"
      outputLabel="Node.js"
      placeholder="curl https://api.example.com/users"
      sample={`curl -X POST https://api.stackscope.dev/v1/users \\\n  -H "Authorization: Bearer xxx" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"Ada"}'`}
      transform={toNode}
    />
  );
}
