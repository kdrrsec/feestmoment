/** Maakt een URL-vriendelijke slug (Nederlandse tekens genormaliseerd). */
export function slugifyForUrl(text: string): string {
  const s = text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return s
}
