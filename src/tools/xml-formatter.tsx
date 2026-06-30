import xmlFormat from "xml-formatter";
import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function XmlFormatter() {
  return (
    <TextTransform
      inputLabel="XML"
      outputLabel="Formatted XML"
      placeholder="<root><item>1</item></root>"
      sample={`<?xml version="1.0"?><note><to>Dev</to><from>DevKitX</from><body>Hello</body></note>`}
      actionLabel="Format XML"
      transform={(s) => xmlFormat(s, { indentation: "  ", collapseContent: true })}
    />
  );
}
