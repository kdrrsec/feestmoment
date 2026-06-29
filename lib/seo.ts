export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, "")

  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`

  return "http://localhost:4001"
}

export function absoluteUrl(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`
  return `${getSiteUrl()}${normalized}`
}

export const siteName = "Feestmoment Verhuur"
export const defaultSeoDescription =
  "Verhuur van feest- en eventartikelen in Nederland: ballonnenbogen, decoraties en meubilair. Vraag direct een offerte aan."

