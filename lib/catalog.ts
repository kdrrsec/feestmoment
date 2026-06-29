import { prisma } from "@/lib/prisma"
import {
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  getDemoProductBySlug,
} from "@/lib/demo-catalog"

export function isDatabaseConfigured(): boolean {
  return !!(
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL?.trim()
  )
}

type AssortimentFilters = {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}

type ProductRow = (typeof DEMO_PRODUCTS)[number]

function filterDemoProducts(filters: AssortimentFilters): ProductRow[] {
  let items = DEMO_PRODUCTS.filter((p) => p.active)

  if (filters.category) {
    items = items.filter((p) => p.category.slug === filters.category)
  }
  if (filters.minPrice !== undefined) {
    items = items.filter((p) => p.pricePerDay >= filters.minPrice!)
  }
  if (filters.maxPrice !== undefined) {
    items = items.filter((p) => p.pricePerDay <= filters.maxPrice!)
  }
  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase()
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false)
    )
  }

  switch (filters.sortBy) {
    case "prijs-laag":
      items.sort((a, b) => a.pricePerDay - b.pricePerDay)
      break
    case "prijs-hoog":
      items.sort((a, b) => b.pricePerDay - a.pricePerDay)
      break
    case "naam":
      items.sort((a, b) => a.name.localeCompare(b.name, "nl"))
      break
    default:
      items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  return items
}

export async function getPopularProducts(limit = 6) {
  if (!isDatabaseConfigured()) {
    return DEMO_PRODUCTS.slice(0, limit)
  }
  try {
    return await prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      take: limit,
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Database error, demo fallback:", error)
    return DEMO_PRODUCTS.slice(0, limit)
  }
}

export async function getAssortiment(filters: AssortimentFilters) {
  if (!isDatabaseConfigured()) {
    return {
      products: filterDemoProducts(filters),
      categories: DEMO_CATEGORIES,
    }
  }

  try {
    const whereConditions: Record<string, unknown>[] = [{ active: true }]

    if (filters.category) {
      whereConditions.push({ category: { slug: filters.category } })
    }
    if (filters.minPrice !== undefined) {
      whereConditions.push({ pricePerDay: { gte: filters.minPrice } })
    }
    if (filters.maxPrice !== undefined) {
      whereConditions.push({ pricePerDay: { lte: filters.maxPrice } })
    }
    if (filters.search?.trim()) {
      const searchTerm = filters.search.trim()
      whereConditions.push({
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } },
        ],
      })
    }

    const where =
      whereConditions.length === 1
        ? whereConditions[0]
        : { AND: whereConditions }

    const orderBy: Record<string, "asc" | "desc"> = {}
    switch (filters.sortBy) {
      case "prijs-laag":
        orderBy.pricePerDay = "asc"
        break
      case "prijs-hoog":
        orderBy.pricePerDay = "desc"
        break
      case "naam":
        orderBy.name = "asc"
        break
      default:
        orderBy.createdAt = "desc"
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
      }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ])

    return { products, categories }
  } catch (error) {
    console.error("Database error, demo fallback:", error)
    return {
      products: filterDemoProducts(filters),
      categories: DEMO_CATEGORIES,
    }
  }
}

export async function getProductBySlug(slug: string) {
  if (!isDatabaseConfigured()) {
    return getDemoProductBySlug(slug)
  }
  try {
    return await prisma.product.findUnique({
      where: { slug, active: true },
      include: { category: true },
    })
  } catch (error) {
    console.error("Database error, demo fallback:", error)
    return getDemoProductBySlug(slug)
  }
}
