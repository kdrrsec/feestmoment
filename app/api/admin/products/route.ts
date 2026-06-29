import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description, categoryId, pricePerDay, deposit, stockQty, images, active } = body

    const imagesJson =
      typeof images === "string"
        ? images
        : JSON.stringify(Array.isArray(images) ? images : [])

    // Find or create category
    let category
    if (categoryId) {
      category = await prisma.category.findUnique({ where: { id: categoryId } })
    }

    if (!category) {
      return NextResponse.json({ error: "Categorie niet gevonden" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId: category.id,
        pricePerDay: parseFloat(pricePerDay),
        deposit: parseFloat(deposit || 0),
        stockQty: parseInt(stockQty),
        images: imagesJson,
        active: active ?? true,
      },
    })

    revalidatePath("/assortiment")
    revalidatePath(`/product/${product.slug}`)

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Product creation error:", error)
    return NextResponse.json(
      { error: error.message || "Fout bij aanmaken product" },
      { status: 500 }
    )
  }
}
