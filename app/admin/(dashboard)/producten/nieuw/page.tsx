import { prisma } from "@/lib/prisma"
import { ProductEditor } from "@/components/admin/product-editor"

export default async function AdminNewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })

  return <ProductEditor categories={categories} />
}
