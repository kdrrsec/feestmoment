import { NextResponse } from "next/server"

import { getStripe } from "@/lib/stripe"

import { prisma } from "@/lib/prisma"

import { checkProductAvailability } from "@/lib/reservation-availability"

import { parseReservationRangeDate } from "@/lib/reservation-dates"

import { lockProductRows } from "@/lib/reservation-lock"



type CartItemIn = {

  productId: string

  productName?: string

  startDate: string

  endDate: string

  quantity: number

  pricePerDay: number

  subtotal: number

}



type PreparedItem = {

  productId: string

  label: string

  rangeStart: Date

  rangeEnd: Date

  quantity: number

  pricePerDay: number

  subtotal: number

}



export async function POST(request: Request) {

  try {

    const body = await request.json()

    const { items, customer, totals } = body as {

      items: CartItemIn[]

      customer: Record<string, string>

      totals: { subtotal: number; deposit: number; deliveryFee: number; total: number }

    }



    if (!items || items.length === 0) {

      return NextResponse.json(

        { error: "Geen items in winkelmand" },

        { status: 400 }

      )

    }



    const prepared: PreparedItem[] = []



    for (const item of items) {

      const product = await prisma.product.findUnique({

        where: { id: item.productId },

      })

      if (!product || !product.active) {

        return NextResponse.json(

          { error: "Een product in de winkelmand is niet meer beschikbaar." },

          { status: 400 }

        )

      }

      const rangeStart = parseReservationRangeDate(String(item.startDate))

      const rangeEnd = parseReservationRangeDate(String(item.endDate))

      if (!rangeStart || !rangeEnd || rangeStart > rangeEnd) {

        return NextResponse.json(

          { error: "Ongeldige huurperiode in de winkelmand." },

          { status: 400 }

        )

      }

      const qty = Math.min(99, Math.max(1, parseInt(String(item.quantity), 10) || 1))

      prepared.push({

        productId: item.productId,

        label: item.productName || "Product",

        rangeStart,

        rangeEnd,

        quantity: qty,

        pricePerDay: item.pricePerDay,

        subtotal: item.subtotal,

      })

    }



    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json(
        {
          error:
            "Online betalen is nog niet geconfigureerd. Neem contact met ons op of probeer het later opnieuw.",
        },
        { status: 503 }
      )
    }

    const order = await prisma.$transaction(async (tx) => {

      await lockProductRows(

        tx,

        prepared.map((p) => p.productId)

      )



      for (const p of prepared) {

        const product = await tx.product.findUnique({

          where: { id: p.productId },

        })

        if (!product || !product.active) {

          throw new Error("CHECKOUT:inactive")

        }

        const avail = await checkProductAvailability(

          tx,

          p.productId,

          p.rangeStart,

          p.rangeEnd,

          p.quantity,

          product.stockQty

        )

        if (!avail.available) {

          throw new Error(`CHECKOUT:conflict:${p.label}:${avail.message}`)

        }

      }



      const first = prepared[0]

      const createdOrder = await tx.rentalOrder.create({

        data: {

          customerName: customer.name,

          customerEmail: customer.email,

          customerPhone: customer.phone,

          startDate: first.rangeStart,

          endDate: first.rangeEnd,

          deliveryType: customer.deliveryType,

          deliveryAddress: customer.deliveryAddress || null,

          deliveryCity: customer.deliveryCity || null,

          deliveryZipCode: customer.deliveryZipCode || null,

          subtotal: totals.subtotal,

          deliveryFee: totals.deliveryFee,

          deposit: totals.deposit,

          total: totals.total,

          status: "PENDING",

        },

      })



      for (const p of prepared) {

        await tx.rentalOrderItem.create({

          data: {

            orderId: createdOrder.id,

            productId: p.productId,

            quantity: p.quantity,

            unitPrice: p.pricePerDay,

            lineTotal: p.subtotal,

          },

        })



        await tx.reservation.create({

          data: {

            productId: p.productId,

            orderId: createdOrder.id,

            startDate: p.rangeStart,

            endDate: p.rangeEnd,

            quantity: p.quantity,

          },

        })

      }



      return createdOrder

    })



    const session = await stripe.checkout.sessions.create({

      payment_method_types: ["card", "ideal", "bancontact"],

      line_items: [

        {

          price_data: {

            currency: "eur",

            product_data: {

              name: `Reservering #${order.id.slice(0, 8)}`,

              description: `${items.length} product(en)`,

            },

            unit_amount: Math.round(totals.total * 100),

          },

          quantity: 1,

        },

      ],

      mode: "payment",

      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/bedankt?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/winkelmand`,

      customer_email: customer.email,

      metadata: {

        orderId: order.id,

      },

    })



    await prisma.rentalOrder.update({

      where: { id: order.id },

      data: { stripeSessionId: session.id },

    })



    return NextResponse.json({ url: session.url })

  } catch (error: unknown) {

    const msg = error instanceof Error ? error.message : ""

    if (msg === "CHECKOUT:inactive") {

      return NextResponse.json(

        { error: "Een product in de winkelmand is niet meer beschikbaar." },

        { status: 400 }

      )

    }

    if (msg.startsWith("CHECKOUT:conflict:")) {

      const rest = msg.replace(/^CHECKOUT:conflict:/, "")

      const colon = rest.indexOf(":")

      const label = colon >= 0 ? rest.slice(0, colon) : "Product"

      const detail = colon >= 0 ? rest.slice(colon + 1) : rest

      return NextResponse.json({ error: `${label}: ${detail}` }, { status: 409 })

    }

    console.error("Checkout error:", error)

    return NextResponse.json(

      { error: error instanceof Error ? error.message : "Checkout mislukt" },

      { status: 500 }

    )

  }

}

