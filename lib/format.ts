const SHORT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const LONG = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatShortDate(iso: string | null): string {
  return iso ? SHORT.format(new Date(iso)) : "";
}

export function formatLongDate(iso: string | null): string {
  return iso ? LONG.format(new Date(iso)) : "";
}

export function formatMonth(iso: string | null): string {
  return iso ? iso.slice(0, 7) : "";
}
