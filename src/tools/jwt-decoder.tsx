import { decodeJwt, decodeProtectedHeader } from "jose";
import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function JwtDecoder() {
  return (
    <TextTransform
      live
      inputLabel="JWT"
      outputLabel="Decoded"
      placeholder="eyJhbGciOi..."
      sample={`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNzEwMDAwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}
      transform={(s) => {
        const token = s.trim();
        const header = decodeProtectedHeader(token);
        const payload = decodeJwt(token);
        return [
          "// HEADER",
          JSON.stringify(header, null, 2),
          "",
          "// PAYLOAD",
          JSON.stringify(payload, null, 2),
        ].join("\n");
      }}
    />
  );
}
