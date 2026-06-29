import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const existing = await prisma.product.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: "Product niet gevonden" }, { status: 404 })
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        categoryId,
        pricePerDay: parseFloat(pricePerDay),
        deposit: parseFloat(deposit || 0),
        stockQty: parseInt(stockQty),
        images: imagesJson,
        active: active ?? true,
      },
    })

    revalidatePath("/assortiment")
    revalidatePath(`/product/${existing.slug}`)
    if (existing.slug !== product.slug) {
      revalidatePath(`/product/${product.slug}`)
    }

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Product update error:", error)
    return NextResponse.json(
      { error: error.message || "Fout bij bijwerken product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existing = await prisma.product.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: "Product niet gevonden" }, { status: 404 })
    }

    await prisma.product.delete({
      where: { id: params.id },
    })

    revalidatePath("/assortiment")
    revalidatePath(`/product/${existing.slug}`)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Product deletion error:", error)
    return NextResponse.json(
      { error: error.message || "Fout bij verwijderen product" },
      { status: 500 }
    )
  }
}
