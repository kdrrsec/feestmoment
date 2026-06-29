import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

import { parseDateInputLocal, isValidYmd } from "@/lib/reservation-dates"

import { checkProductAvailability } from "@/lib/reservation-availability"

import { lockProductRows } from "@/lib/reservation-lock"



const MAX_QTY = 99



/**

 * Publiek: legt een reservering vast wanneer een bezoeker naar WhatsApp gaat

 * (datums staan dan in de agenda / bestellingen-overzicht).

 */

export async function POST(request: Request) {

  try {

    const body = await request.json()

    const {

      productId,

      startDate: startDateStr,

      endDate: endDateStr,

      quantity,

      customerName,

      customerPhone,

    } = body as {

      productId?: string

      startDate?: string

      endDate?: string

      quantity?: number

      customerName?: string | null

      customerPhone?: string | null

    }



    if (!productId || !startDateStr || !endDateStr) {

      return NextResponse.json({ error: "Ontbrekende gegevens" }, { status: 400 })

    }



    if (!isValidYmd(startDateStr) || !isValidYmd(endDateStr)) {

      return NextResponse.json({ error: "Ongeldige datum" }, { status: 400 })

    }



    const qty = Math.min(MAX_QTY, Math.max(1, parseInt(String(quantity || 1), 10) || 1))



    const startDate = parseDateInputLocal(startDateStr)

    const endDate = parseDateInputLocal(endDateStr)



    if (startDate > endDate) {

      return NextResponse.json({ error: "Einddatum voor startdatum" }, { status: 400 })

    }



    const result = await prisma.$transaction(async (tx) => {

      await lockProductRows(tx, [productId])



      const product = await tx.product.findFirst({

        where: { id: productId, active: true },

      })

      if (!product) {

        return { kind: "not_found" as const }

      }



      const availability = await checkProductAvailability(

        tx,

        productId,

        startDate,

        endDate,

        qty,

        product.stockQty

      )

      if (!availability.available) {

        return {

          kind: "conflict" as const,

          message: availability.message,

        }

      }



      const reservation = await tx.reservation.create({

        data: {

          productId,

          startDate,

          endDate,

          quantity: qty,

          source: "WHATSAPP",

          customerName: customerName?.trim() || null,

          customerPhone: customerPhone?.trim() || null,

          notes: "Aangemaakt via website (WhatsApp-stap)",

        },

      })



      return { kind: "ok" as const, reservation }

    })



    if (result.kind === "not_found") {

      return NextResponse.json({ error: "Product niet gevonden" }, { status: 404 })

    }

    if (result.kind === "conflict") {

      return NextResponse.json(

        { error: result.message, available: false },

        { status: 409 }

      )

    }



    return NextResponse.json({ id: result.reservation.id, ok: true })

  } catch (e) {

    console.error("whatsapp-hold:", e)

    return NextResponse.json({ error: "Serverfout" }, { status: 500 })

  }

}

