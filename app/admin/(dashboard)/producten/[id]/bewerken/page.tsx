import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductEditor } from "@/components/admin/product-editor"

type PageProps = { params: { id: string } }

export default async function AdminEditProductPage({ params }: PageProps) {
  const [categories, product] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.product.findUnique({
      where: { id: params.id },
    }),
  ])

  if (!product) {
    notFound()
  }

  return (
    <ProductEditor
      key={product.updatedAt.toISOString()}
      categories={categories}
      product={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        categoryId: product.categoryId,
        pricePerDay: product.pricePerDay,
        deposit: product.deposit,
        stockQty: product.stockQty,
        images: product.images,
        active: product.active,
      }}
    />
  )
}
