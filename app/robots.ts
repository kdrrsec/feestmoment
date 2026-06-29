import type { MetadataRoute } from "next"

function baseUrl(): string {
  const u = process.env.NEXT_PUBLIC_URL?.trim()
  if (u) return u.replace(/\/$/, "")
  return "http://localhost:4001"
}

export default function robots(): MetadataRoute.Robots {
  const base = baseUrl()
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/winkelmand", "/bedankt"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
