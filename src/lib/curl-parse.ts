// Minimal curl command parser. Handles the flags we care about for code generation:
// -X/--request, -H/--header, -d/--data/--data-raw/--data-binary, -u/--user, -b/--cookie,
// --url, -F/--form, -I/--head, --compressed (ignored), -k/--insecure (ignored).
// Supports single/double quoted args, backslash line-continuations, and \" escapes.

export interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  data?: string;
  isJson: boolean;
  auth?: { user: string; pass: string };
}

function tokenize(input: string): string[] {
  // strip line continuations
  const src = input.replace(/\\\r?\n/g, " ").trim();
  const out: string[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === " " || c === "\t" || c === "\n") {
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      const quote = c;
      i++;
      let buf = "";
      while (i < src.length && src[i] !== quote) {
        if (src[i] === "\\" && i + 1 < src.length && quote === '"') {
          buf += src[i + 1];
          i += 2;
        } else {
          buf += src[i++];
        }
      }
      i++; // closing quote
      out.push(buf);
    } else {
      let buf = "";
      while (i < src.length && src[i] !== " " && src[i] !== "\t" && src[i] !== "\n") {
        if (src[i] === "\\" && i + 1 < src.length) {
          buf += src[i + 1];
          i += 2;
        } else {
          buf += src[i++];
        }
      }
      out.push(buf);
    }
  }
  return out;
}

export function parseCurl(raw: string): ParsedCurl {
  const tokens = tokenize(raw);
  if (tokens.length === 0) throw new Error("Empty input.");
  if (tokens[0] === "curl") tokens.shift();

  let url = "";
  let method = "";
  const headers: Record<string, string> = {};
  const dataParts: string[] = [];
  let auth: { user: string; pass: string } | undefined;
  let formMode = false;

  const next = (i: number, flag: string): string => {
    if (i + 1 >= tokens.length) throw new Error(`Missing value for ${flag}.`);
    return tokens[i + 1];
  };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "-X" || t === "--request") {
      method = next(i, t).toUpperCase();
      i++;
    } else if (t === "-H" || t === "--header") {
      const h = next(i, t);
      const idx = h.indexOf(":");
      if (idx > 0) headers[h.slice(0, idx).trim()] = h.slice(idx + 1).trim();
      i++;
    } else if (
      t === "-d" ||
      t === "--data" ||
      t === "--data-raw" ||
      t === "--data-binary" ||
      t === "--data-ascii"
    ) {
      dataParts.push(next(i, t));
      i++;
    } else if (t === "-F" || t === "--form") {
      formMode = true;
      dataParts.push(next(i, t));
      i++;
    } else if (t === "-u" || t === "--user") {
      const v = next(i, t);
      const sep = v.indexOf(":");
      auth = sep >= 0 ? { user: v.slice(0, sep), pass: v.slice(sep + 1) } : { user: v, pass: "" };
      i++;
    } else if (t === "-b" || t === "--cookie") {
      headers["Cookie"] = next(i, t);
      i++;
    } else if (t === "-A" || t === "--user-agent") {
      headers["User-Agent"] = next(i, t);
      i++;
    } else if (t === "-e" || t === "--referer") {
      headers["Referer"] = next(i, t);
      i++;
    } else if (t === "--url") {
      url = next(i, t);
      i++;
    } else if (t === "-I" || t === "--head") {
      method ||= "HEAD";
    } else if (
      t === "--compressed" ||
      t === "-k" ||
      t === "--insecure" ||
      t === "-L" ||
      t === "--location" ||
      t === "-s" ||
      t === "--silent" ||
      t === "-v" ||
      t === "--verbose" ||
      t === "-i" ||
      t === "--include"
    ) {
      // ignored
    } else if (t.startsWith("-")) {
      // unknown flag, try to skip its value if next token isn't a flag
      if (i + 1 < tokens.length && !tokens[i + 1].startsWith("-") && !/^https?:\/\//i.test(tokens[i + 1])) {
        i++;
      }
    } else if (!url) {
      url = t;
    }
  }

  if (!url) throw new Error("Could not find a URL in the curl command.");

  const data = dataParts.length ? dataParts.join(formMode ? "&" : "&") : undefined;
  if (!method) method = data ? "POST" : "GET";

  const contentType = headers["Content-Type"] ?? headers["content-type"];
  const isJson = !!contentType && /json/i.test(contentType);

  if (auth && !headers["Authorization"] && !headers["authorization"]) {
    const token = typeof btoa !== "undefined"
      ? btoa(`${auth.user}:${auth.pass}`)
      : Buffer.from(`${auth.user}:${auth.pass}`).toString("base64");
    headers["Authorization"] = `Basic ${token}`;
  }

  return { url, method, headers, data, isJson, auth };
}

const jsStr = (s: string) => JSON.stringify(s);
const pyStr = (s: string) => JSON.stringify(s);
const javaStr = (s: string) => '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';

export function toFetch(raw: string): string {
  const r = parseCurl(raw);
  const opts: string[] = [`  method: ${jsStr(r.method)},`];
  if (Object.keys(r.headers).length) {
    const lines = Object.entries(r.headers).map(([k, v]) => `    ${jsStr(k)}: ${jsStr(v)}`);
    opts.push(`  headers: {\n${lines.join(",\n")},\n  },`);
  }
  if (r.data !== undefined) {
    if (r.isJson) {
      try {
        const parsed = JSON.parse(r.data);
        opts.push(`  body: JSON.stringify(${JSON.stringify(parsed, null, 2).replace(/\n/g, "\n  ")}),`);
      } catch {
        opts.push(`  body: ${jsStr(r.data)},`);
      }
    } else {
      opts.push(`  body: ${jsStr(r.data)},`);
    }
  }
  return `const response = await fetch(${jsStr(r.url)}, {\n${opts.join("\n")}\n});\nconst data = await response.json();\nconsole.log(data);\n`;
}

export function toPython(raw: string): string {
  const r = parseCurl(raw);
  const lines = ["import requests", ""];
  if (Object.keys(r.headers).length) {
    lines.push("headers = {");
    Object.entries(r.headers).forEach(([k, v]) => lines.push(`    ${pyStr(k)}: ${pyStr(v)},`));
    lines.push("}");
  }
  let dataExpr = "";
  if (r.data !== undefined) {
    if (r.isJson) {
      try {
        const parsed = JSON.parse(r.data);
        lines.push(`json_data = ${JSON.stringify(parsed, null, 4)}`);
        dataExpr = ", json=json_data";
      } catch {
        lines.push(`data = ${pyStr(r.data)}`);
        dataExpr = ", data=data";
      }
    } else {
      lines.push(`data = ${pyStr(r.data)}`);
      dataExpr = ", data=data";
    }
  }
  const headersExpr = Object.keys(r.headers).length ? ", headers=headers" : "";
  lines.push("");
  lines.push(
    `response = requests.${r.method.toLowerCase()}(${pyStr(r.url)}${headersExpr}${dataExpr})`,
  );
  lines.push("print(response.json())");
  return lines.join("\n") + "\n";
}

export function toNode(raw: string): string {
  const r = parseCurl(raw);
  const opts: string[] = [`  method: ${jsStr(r.method)},`];
  if (Object.keys(r.headers).length) {
    const hl = Object.entries(r.headers).map(([k, v]) => `    ${jsStr(k)}: ${jsStr(v)}`);
    opts.push(`  headers: {\n${hl.join(",\n")},\n  },`);
  }
  let bodyLine = "";
  if (r.data !== undefined) {
    bodyLine = `\nreq.write(${jsStr(r.data)});`;
  }
  return `import https from "node:https";\n\nconst options = {\n${opts.join("\n")}\n};\n\nconst req = https.request(${jsStr(r.url)}, options, (res) => {\n  let body = "";\n  res.on("data", (chunk) => (body += chunk));\n  res.on("end", () => console.log(body));\n});\n\nreq.on("error", console.error);${bodyLine}\nreq.end();\n`;
}

export function toJava(raw: string): string {
  const r = parseCurl(raw);
  const lines = [
    "import java.net.URI;",
    "import java.net.http.HttpClient;",
    "import java.net.http.HttpRequest;",
    "import java.net.http.HttpResponse;",
    "",
    "HttpClient client = HttpClient.newHttpClient();",
    "",
    "HttpRequest request = HttpRequest.newBuilder()",
    `    .uri(URI.create(${javaStr(r.url)}))`,
  ];
  Object.entries(r.headers).forEach(([k, v]) =>
    lines.push(`    .header(${javaStr(k)}, ${javaStr(v)})`),
  );
  const bodyExpr =
    r.data !== undefined
      ? `HttpRequest.BodyPublishers.ofString(${javaStr(r.data)})`
      : "HttpRequest.BodyPublishers.noBody()";
  const method = r.method.toUpperCase();
  if (method === "GET") lines.push("    .GET()");
  else if (method === "DELETE") lines.push("    .DELETE()");
  else if (method === "POST") lines.push(`    .POST(${bodyExpr})`);
  else if (method === "PUT") lines.push(`    .PUT(${bodyExpr})`);
  else lines.push(`    .method(${javaStr(method)}, ${bodyExpr})`);
  lines.push("    .build();");
  lines.push("");
  lines.push("HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());");
  lines.push("System.out.println(response.body());");
  return lines.join("\n") + "\n";
}
