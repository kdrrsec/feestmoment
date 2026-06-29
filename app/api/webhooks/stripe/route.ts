import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(request: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: "Stripe niet geconfigureerd" }, { status: 503 })
  }

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      // Update order status to PAID
      await prisma.rentalOrder.update({
        where: { stripeSessionId: session.id },
        data: {
          status: "PAID",
          stripePaymentIntentId: session.payment_intent as string,
        },
      })
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Find order by payment intent and update
      const order = await prisma.rentalOrder.findFirst({
        where: { stripePaymentIntentId: paymentIntent.id },
      })

      if (order) {
        await prisma.rentalOrder.update({
          where: { id: order.id },
          data: { status: "PAID" },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
