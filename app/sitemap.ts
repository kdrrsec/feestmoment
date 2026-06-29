import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

function baseUrl(): string {
  const u = process.env.NEXT_PUBLIC_URL?.trim()
  if (u) return u.replace(/\/$/, "")
  return "http://localhost:4001"
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = baseUrl()
  const staticPaths = [
    "",
    "/assortiment",
    "/contact",
    "/over-ons",
    "/offerte",
    "/voorwaarden",
    "/privacy",
    "/cookies",
  ]

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.85,
  }))

  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    })
    for (const p of products) {
      entries.push({
        url: `${base}/product/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.75,
      })
    }
  } catch {
    // DB niet bereikbaar tijdens build — statische routes blijven staan
  }

  return entries
}
