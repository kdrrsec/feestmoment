import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { notifyNewLeadByEmail } from "@/lib/email/notify-new-lead"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>

    const name = String(body.name ?? "").trim()
    const email = String(body.email ?? "").trim()
    let message = String(body.message ?? "").trim()
    const phone = body.phone != null ? String(body.phone).trim() : ""
    const budget = body.budget != null ? String(body.budget).trim() : ""
    const source = body.source != null ? String(body.source).trim() : ""
    const eventDateRaw = body.eventDate

    const location = body.location != null ? String(body.location).trim() : ""
    const eventType = body.eventType != null ? String(body.eventType).trim() : ""
    const colorTheme = body.colorTheme != null ? String(body.colorTheme).trim() : ""
    const subject = body.subject != null ? String(body.subject).trim() : ""

    if (subject) {
      message = [`Onderwerp: ${subject}`, "", message].filter(Boolean).join("\n")
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Naam, email en bericht zijn verplicht" },
        { status: 400 }
      )
    }

    const detailLines: string[] = []
    if (source === "offerte") detailLines.push("Aanvraag: offerte")
    if (location) detailLines.push(`Locatie: ${location}`)
    if (eventType) detailLines.push(`Type event: ${eventType}`)
    if (colorTheme) detailLines.push(`Kleurthema: ${colorTheme}`)

    if (detailLines.length > 0) {
      message = [message, "", "—", ...detailLines].join("\n")
    }

    let eventDateParsed: Date | null = null
    if (eventDateRaw) {
      const d = new Date(String(eventDateRaw))
      if (!Number.isNaN(d.getTime())) eventDateParsed = d
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        eventDate: eventDateParsed,
        message,
        budget: budget || null,
        status: "NEW",
      },
    })

    void notifyNewLeadByEmail({
      name,
      email,
      phone: phone || null,
      message,
      eventDate: eventDateParsed,
      budget: budget || null,
    })

    return NextResponse.json({ success: true, lead })
  } catch (error: unknown) {
    console.error("Lead creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fout bij aanmaken lead" },
      { status: 500 }
    )
  }
}
