import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { AdminProductsList } from "@/components/admin/admin-products-list"
import { Plus } from "lucide-react"

async function getProducts() {
  try {
    return await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    })
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    pricePerDay: p.pricePerDay,
    deposit: p.deposit,
    stockQty: p.stockQty,
    active: p.active,
    category: { name: p.category.name },
  }))

  return (
    <div className="bg-white">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#111111]">Assortiment</h1>
          <p className="mt-1 text-sm text-[#666666]">
            Zoek producten en open een volledige bewerkpagina om alles aan te passen.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto shrink-0">
          <Link href="/admin/producten/nieuw">
            <Plus className="h-4 w-4 mr-2" />
            Nieuw product
          </Link>
        </Button>
      </div>

      <AdminProductsList products={rows} />
    </div>
  )
}
