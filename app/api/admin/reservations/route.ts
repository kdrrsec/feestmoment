import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseDateInputLocal, isValidYmd } from "@/lib/reservation-dates"
import { checkProductAvailability } from "@/lib/reservation-availability"
import { lockProductRows } from "@/lib/reservation-lock"

const MAX_QTY = 99

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      productId,
      startDate: startDateStr,
      endDate: endDateStr,
      quantity,
      customerName,
      customerPhone,
      notes,
    } = body as {
      productId?: string
      startDate?: string
      endDate?: string
      quantity?: number
      customerName?: string | null
      customerPhone?: string | null
      notes?: string | null
    }

    if (!productId || !startDateStr || !endDateStr) {
      return NextResponse.json({ error: "Vul product en datums in" }, { status: 400 })
    }

    if (!isValidYmd(startDateStr) || !isValidYmd(endDateStr)) {
      return NextResponse.json({ error: "Ongeldige datum" }, { status: 400 })
    }

    const qty = Math.min(MAX_QTY, Math.max(1, parseInt(String(quantity || 1), 10) || 1))

    const startDate = parseDateInputLocal(startDateStr)
    const endDate = parseDateInputLocal(endDateStr)

    if (startDate > endDate) {
      return NextResponse.json({ error: "Einddatum moet op of na startdatum liggen" }, { status: 400 })
    }

    const reservation = await prisma.$transaction(async (tx) => {
      await lockProductRows(tx, [productId])

      const productLocked = await tx.product.findUnique({ where: { id: productId } })
      if (!productLocked) {
        return null
      }

      const availability = await checkProductAvailability(
        tx,
        productId,
        startDate,
        endDate,
        qty,
        productLocked.stockQty
      )
      if (!availability.available) {
        throw new Error(`CONFLICT:${availability.message}`)
      }

      return tx.reservation.create({
        data: {
          productId,
          startDate,
          endDate,
          quantity: qty,
          source: "ADMIN",
          customerName: customerName?.trim() || null,
          customerPhone: customerPhone?.trim() || null,
          notes: notes?.trim() || null,
        },
      })
    })

    if (!reservation) {
      return NextResponse.json({ error: "Product niet gevonden" }, { status: 404 })
    }

    return NextResponse.json(reservation)
  } catch (e) {
    const msg = e instanceof Error ? e.message : ""
    if (msg.startsWith("CONFLICT:")) {
      return NextResponse.json(
        { error: msg.replace(/^CONFLICT:/, "") },
        { status: 409 }
      )
    }
    console.error("admin reservations POST:", e)
    return NextResponse.json({ error: "Serverfout" }, { status: 500 })
  }
}
