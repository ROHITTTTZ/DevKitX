import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <Logo size={28} />
              <span className="font-semibold">DevKitX</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              A premium collection of free, browser-based utilities for developers.
            </p>
          </div>
          <FooterCol
            title="Product"
            links={[
              { label: "All Tools", to: "/tools" },
              { label: "Dashboard", to: "/dashboard" },
            ]}
          />
          <FooterCol
            title="Categories"
            links={[
              { label: "Generators", to: "/tools?cat=Generators" },
              { label: "Converters", to: "/tools?cat=Converters" },
              { label: "Text Tools", to: "/tools?cat=Text Tools" },
              { label: "Encoders", to: "/tools?cat=Encoders" },
            ]}
          />
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DevKitX. Built by{" "}
            <a
              href="https://www.linkedin.com/in/rohith-pradeep/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Rohith Pradeep
            </a>
          </p>
          <p className="text-xs text-muted-foreground">100% client-side · no tracking</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.to}
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
