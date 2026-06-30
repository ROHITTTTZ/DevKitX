import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";

export function useFavorites() {
  const [favs, setFavs] = useLocalStorage<string[]>("ss-favorites", []);
  const toggle = useCallback(
    (slug: string) =>
      setFavs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug])),
    [setFavs],
  );
  const isFav = useCallback((slug: string) => favs.includes(slug), [favs]);
  return { favorites: favs, toggle, isFav };
}

export function useRecent() {
  const [recent, setRecent] = useLocalStorage<string[]>("ss-recent", []);
  const push = useCallback(
    (slug: string) =>
      setRecent((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 8)),
    [setRecent],
  );
  return { recent, push };
}

export type DevRole = "Frontend" | "Backend" | "DevOps" | "Security";

export function useRole() {
  const [role, setRole] = useLocalStorage<DevRole | null>("ss-role", null);
  return { role, setRole };
}

export function useUsage() {
  const [usage, setUsage] = useLocalStorage<Record<string, number>>("ss-usage", {});
  const bump = useCallback(
    (slug: string) =>
      setUsage((prev) => ({ ...prev, [slug]: (prev[slug] ?? 0) + 1 })),
    [setUsage],
  );
  return { usage, bump };
}
