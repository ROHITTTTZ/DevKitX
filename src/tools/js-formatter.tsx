import { js as beautifyJs } from "js-beautify";
import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function JsFormatter() {
  return (
    <TextTransform
      inputLabel="JavaScript"
      outputLabel="Formatted JavaScript"
      placeholder="function add(a,b){return a+b}"
      sample={`const fn=(a,b)=>{if(a>b){return a}else{return b}};console.log(fn(1,2));`}
      actionLabel="Format JS"
      transform={(s) =>
        beautifyJs(s, { indent_size: 2, space_in_empty_paren: false, end_with_newline: true })
      }
    />
  );
}
