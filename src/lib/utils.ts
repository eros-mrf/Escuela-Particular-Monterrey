export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/** Minúsculas sin tildes, para búsquedas y filtros. */
export function normalize(text: string): string {
  return (text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function slugify(text: string): string {
  return (
    normalize(text)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "sin-titulo"
  );
}

export function uniqueSlug(base: string, taken: Iterable<string>): string {
  const used = new Set(taken);
  let slug = slugify(base);
  if (!used.has(slug)) return slug;
  let i = 2;
  while (used.has(`${slug}-${i}`)) i++;
  slug = `${slug}-${i}`;
  return slug;
}

export function formatBytes(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

/** Solo permite enlaces http(s) y rutas internas. */
export function safeUrl(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  try {
    const u = new URL(trimmed);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export function pick<T>(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
