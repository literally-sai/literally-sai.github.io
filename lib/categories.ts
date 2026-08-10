import { site } from "./site";

export const ALL_FILTER = "All";

export function buildFilters(entries: { category: string }[]): string[] {
  if (site.filterMode === "config") {
    return [ALL_FILTER, ...site.categoryOrder];
  }

  const present = new Set(entries.map((entry) => entry.category));
  const known = site.categoryOrder.filter((category) => present.has(category));
  const unknown = [...present]
    .filter((category) => !site.categoryOrder.includes(category))
    .sort((a, b) => a.localeCompare(b));

  return [ALL_FILTER, ...known, ...unknown];
}

export function matchesFilter(
  entry: { category: string },
  filter: string,
): boolean {
  return (
    filter === ALL_FILTER ||
    entry.category.toLowerCase() === filter.toLowerCase()
  );
}
