import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function XmlValidator() {
  return (
    <TextTransform
      live
      inputLabel="XML"
      outputLabel="Result"
      placeholder="<root/>"
      sample={`<note><to>Dev</to><from>DevKitX</from></note>`}
      transform={(s) => {
        const doc = new DOMParser().parseFromString(s, "application/xml");
        const err = doc.querySelector("parsererror");
        if (err) throw new Error(err.textContent || "Invalid XML");
        return "✓ Valid XML";
      }}
    />
  );
}
