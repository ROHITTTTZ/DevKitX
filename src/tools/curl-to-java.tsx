import { TextTransform } from "@/components/tool-kit/TextTransform";
import { toJava } from "@/lib/curl-parse";

export default function CurlToJava() {
  return (
    <TextTransform
      live
      inputLabel="curl command"
      outputLabel="Java (HttpClient)"
      placeholder="curl https://api.example.com/users"
      sample={`curl -X POST https://api.stackscope.dev/v1/users \\\n  -H "Authorization: Bearer xxx" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"Ada"}'`}
      transform={toJava}
    />
  );
}
