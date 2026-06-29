import { Resend } from "resend"

type LeadPayload = {
  name: string
  email: string
  phone: string | null
  message: string
  eventDate: Date | null
  budget: string | null
}

/**
 * Stuurt een notificatiemail bij een nieuwe lead (Resend).
 * Alleen actief als RESEND_API_KEY en LEAD_NOTIFICATION_EMAIL gezet zijn.
 * Faalt stil (logt alleen) zodat de API-response niet breekt als mail faalt.
 */
export async function notifyNewLeadByEmail(data: LeadPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.LEAD_NOTIFICATION_EMAIL?.trim()
  if (!apiKey || !to) {
    return
  }

  const from =
    process.env.RESEND_FROM?.trim() ||
    "Feestmoment Verhuur <onboarding@resend.dev>"

  const lines = [
    `Nieuwe lead via het contactformulier`,
    ``,
    `Naam: ${data.name}`,
    `E-mail: ${data.email}`,
    data.phone ? `Telefoon: ${data.phone}` : null,
    data.eventDate
      ? `Evenement: ${data.eventDate.toLocaleString("nl-NL")}`
      : null,
    data.budget ? `Budget: ${data.budget}` : null,
    ``,
    `Bericht:`,
    data.message,
  ].filter(Boolean) as string[]

  const text = lines.join("\n")
  const html = `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(
    text
  )}</pre>`

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to: [to],
      reply_to: data.email,
      subject: `Nieuwe lead: ${data.name}`,
      text,
      html,
    })
    if (error) {
      console.error("Resend lead notification:", error)
    }
  } catch (e) {
    console.error("Resend lead notification failed:", e)
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
