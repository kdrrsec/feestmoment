"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { getSitePhoneDigits } from "@/lib/site-config"

export function FloatingWhatsAppButton() {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) {
    return null
  }

  const whatsappNumber = getSitePhoneDigits()
  const whatsappMessage = encodeURIComponent("Hallo, ik heb een vraag over Feestmoment Verhuur.")
  const href = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Stuur ons een WhatsApp-bericht"
      className="whatsapp-reserve-btn fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full !bg-green-600 shadow-lg transition-transform duration-200 hover:scale-105 hover:!bg-green-500"
    >
      <svg viewBox="0 0 448 512" aria-hidden="true" className="h-6 w-6 fill-white">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-221.7 99.3-221.7 221.7 0 39.1 10.2 77.2 29.6 110.8L0 480l118.9-31.2c32.7 17.8 69.6 27.2 107 27.2h.1c122.3 0 221.6-99.3 221.6-221.7 0-59.3-23.1-115-65.1-157zm-157 341.6h-.1c-33.2 0-65.7-8.9-94-25.6l-6.7-4-70.5 18.5 18.8-68.7-4.3-7.1c-18.5-29.5-28.2-63.6-28.2-98.6 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 54 81.2 54 130.5-.1 101.8-82.9 184.6-184.5 184.6zm101.2-138.2c-5.5-2.8-32.8-16.1-37.9-17.9-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 17.9-17.5 21.6-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-65.8-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.3-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.7 35.1 15.2 48.8 16.5 66.3 13.9 10.7-1.6 32.8-13.4 37.4-26.3 4.6-12.9 4.6-23.9 3.2-26.3-1.3-2.3-5-3.7-10.5-6.4z" />
      </svg>
    </Link>
  )
}
