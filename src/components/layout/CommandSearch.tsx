import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CATEGORIES, TOOLS } from "@/lib/tools";

export function CommandSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const navigate = useNavigate();

  const go = (slug: string) => {
    onOpenChange(false);
    navigate({ to: "/tools/$slug", params: { slug } });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search tools, categories…" />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>
        {CATEGORIES.map((cat) => {
          const items = TOOLS.filter((t) => t.category === cat);
          if (!items.length) return null;
          return (
            <CommandGroup key={cat} heading={cat}>
              {items.map((t) => (
                <CommandItem
                  key={t.slug}
                  value={`${t.name} ${t.keywords.join(" ")}`}
                  onSelect={() => go(t.slug)}
                >
                  <t.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{t.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{t.category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
