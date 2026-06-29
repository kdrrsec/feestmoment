import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkProductAvailability } from "@/lib/reservation-availability"
import { parseReservationRangeDate } from "@/lib/reservation-dates"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, startDate, endDate, quantity } = body

    if (!productId || !startDate || !endDate || !quantity) {
      return NextResponse.json(
        { available: false, message: "Ontbrekende gegevens" },
        { status: 400 }
      )
    }

    const rangeStart =
      typeof startDate === "string" ? parseReservationRangeDate(startDate) : null
    const rangeEnd = typeof endDate === "string" ? parseReservationRangeDate(endDate) : null
    if (!rangeStart || !rangeEnd) {
      return NextResponse.json(
        { available: false, message: "Ongeldige datum" },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product || !product.active) {
      return NextResponse.json(
        { available: false, message: "Product niet gevonden" },
        { status: 404 }
      )
    }

    const qty = Math.min(99, Math.max(1, parseInt(String(quantity), 10) || 1))

    if (rangeStart > rangeEnd) {
      return NextResponse.json(
        { available: false, message: "Einddatum moet op of na de startdatum liggen" },
        { status: 400 }
      )
    }

    const result = await checkProductAvailability(
      prisma,
      productId,
      rangeStart,
      rangeEnd,
      qty,
      product.stockQty
    )

    return NextResponse.json({
      available: result.available,
      message: result.message,
      stockQty: result.stockQty,
      reserved: result.reserved,
      remaining: result.remaining,
    })
  } catch (error) {
    console.error("Availability check error:", error)
    return NextResponse.json(
      { available: false, message: "Serverfout" },
      { status: 500 }
    )
  }
}
