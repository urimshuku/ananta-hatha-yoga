/**
 * Build an absolute API URL on the canonical site host.
 * Ensures form POSTs reach the apex domain even if a visitor is on www.
 */
export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!base) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
