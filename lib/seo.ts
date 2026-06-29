export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_URL?.trim() || "http://localhost:4001"
  return raw.replace(/\/$/, "")
}

export function absoluteUrl(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`
  return `${getSiteUrl()}${normalized}`
}

export const siteName = "Feestmoment Verhuur"
export const defaultSeoDescription =
  "Verhuur van feest- en eventartikelen in Nederland: ballonnenbogen, decoraties en meubilair. Vraag direct een offerte aan."

