import { TextTransform } from "@/components/tool-kit/TextTransform";

export default function UrlParser() {
  return (
    <TextTransform
      live
      inputLabel="URL"
      outputLabel="Parsed components"
      placeholder="https://example.com/path?a=1"
      sample={`https://user:pass@api.stackscope.dev:8443/v1/tools?category=encoder&limit=20#results`}
      transform={(s) => {
        const u = new URL(s.trim());
        const params: Record<string, string> = {};
        u.searchParams.forEach((v, k) => (params[k] = v));
        const out = {
          href: u.href,
          protocol: u.protocol,
          username: u.username || null,
          password: u.password ? "•••" : null,
          host: u.host,
          hostname: u.hostname,
          port: u.port || null,
          pathname: u.pathname,
          search: u.search,
          searchParams: params,
          hash: u.hash || null,
          origin: u.origin,
        };
        return JSON.stringify(out, null, 2);
      }}
    />
  );
}
