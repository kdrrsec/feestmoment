/**
 * Centrale contact-URL’s (alleen NEXT_PUBLIC_* zodat client components ze kunnen lezen).
 * Zet in .env.local: NEXT_PUBLIC_SITE_PHONE, optioneel NEXT_PUBLIC_SITE_PHONE_DISPLAY
 */

const DEFAULT_E164 = "+31612345678"
const DEFAULT_DISPLAY = "+31 6 12345678"

function phoneE164Raw(): string {
  const v = process.env.NEXT_PUBLIC_SITE_PHONE?.trim()
  return v && v.length > 0 ? v.replace(/\s/g, "") : DEFAULT_E164
}

/** E.164 voor tel:-links, bijv. +31612345678 */
export function getSitePhoneE164(): string {
  let s = phoneE164Raw()
  if (!s.startsWith("+")) {
    const digits = s.replace(/\D/g, "")
    s = digits ? `+${digits}` : DEFAULT_E164
  }
  return s
}

/** Alleen cijfers, voor wa.me (bijv. 31612345678) */
export function getSitePhoneDigits(): string {
  return getSitePhoneE164().replace(/\D/g, "")
}

/** tel:+31... href */
export function getSitePhoneTelHref(): string {
  return `tel:${getSitePhoneE164()}`
}

/** Leesbare tekst in de UI */
export function getSitePhoneDisplay(): string {
  const d = process.env.NEXT_PUBLIC_SITE_PHONE_DISPLAY?.trim()
  return d && d.length > 0 ? d : DEFAULT_DISPLAY
}

export function getSiteEmail(): string {
  return process.env.NEXT_PUBLIC_SITE_EMAIL?.trim() || "info@feestmomentverhuur.nl"
}

export function getSiteEmailMailto(): string {
  return `mailto:${getSiteEmail()}`
}
