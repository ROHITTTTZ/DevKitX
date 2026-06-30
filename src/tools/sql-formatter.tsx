import { format } from "sql-formatter";
import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function SqlFormatter() {
  return (
    <TextTransform
      inputLabel="SQL"
      outputLabel="Formatted SQL"
      placeholder="select * from users where id=1"
      sample={`select u.id,u.name,count(o.id) as orders from users u left join orders o on o.user_id=u.id where u.active=true group by u.id,u.name order by orders desc limit 10;`}
      actionLabel="Format SQL"
      transform={(s) => format(s, { language: "sql", keywordCase: "upper", tabWidth: 2 })}
    />
  );
}
