import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  getSiteEmail,
  getSiteEmailMailto,
  getSitePhoneDisplay,
  getSitePhoneTelHref,
} from "@/lib/site-config"

const instagramUrl =
  process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL?.trim() ||
  "https://www.instagram.com/feestmomentverhuur"
const facebookUrl = process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL?.trim()

export function Footer() {
  return (
    <footer className="border-t border-[#E5E5E5] bg-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4 focus:outline-none focus-visible:outline-none">
              <Image
                src="/logo.png"
                alt="Feestmoment Verhuur"
                width={180}
                height={180}
                className="h-[180px] w-auto object-contain"
                unoptimized
              />
            </Link>
            <p className="text-sm text-[#666666] mb-4">
              Uw partner voor feest- en eventartikelen. Elegant, betrouwbaar en servicegericht.
            </p>
            <div className="flex gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#F8F8F8] flex items-center justify-center text-accent-gold hover:text-accent-gold transition-colors focus:outline-none focus-visible:outline-none"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 !stroke-accent-gold !fill-accent-gold">
                  <path
                    className="!stroke-accent-gold !fill-accent-gold"
                    fill="currentColor"
                    d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5Zm8.88 1.88a1.12 1.12 0 1 1 0 2.24 1.12 1.12 0 0 1 0-2.24ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
                  />
                </svg>
              </a>
              {facebookUrl ? (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#F8F8F8] flex items-center justify-center text-accent-gold hover:text-accent-gold transition-colors focus:outline-none focus-visible:outline-none"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 !stroke-accent-gold !fill-accent-gold" />
                </a>
              ) : null}
            </div>
          </div>

          {/* Navigatie */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-[#111111]">Navigatie</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/assortiment" className="text-[#666666] hover:text-accent-gold transition-colors focus:outline-none focus-visible:outline-none">
                  Assortiment
                </Link>
              </li>
              <li>
                <Link href="/offerte" className="text-[#666666] hover:text-accent-gold transition-colors focus:outline-none focus-visible:outline-none">
                  Offerte aanvragen
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="text-[#666666] hover:text-accent-gold transition-colors focus:outline-none focus-visible:outline-none">
                  Over ons
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#666666] hover:text-accent-gold transition-colors focus:outline-none focus-visible:outline-none">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Informatie */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-[#111111]">Informatie</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/voorwaarden" className="text-[#666666] hover:text-accent-gold transition-colors focus:outline-none focus-visible:outline-none">
                  Algemene voorwaarden
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#666666] hover:text-accent-gold transition-colors focus:outline-none focus-visible:outline-none">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-[#666666] hover:text-accent-gold transition-colors focus:outline-none focus-visible:outline-none">
                  Cookiebeleid
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-[#111111]">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-[#666666] mt-0.5 flex-shrink-0" />
                <a 
                  href={getSiteEmailMailto()} 
                  className="text-[#666666] hover:text-accent-gold transition-colors focus:outline-none focus-visible:outline-none"
                >
                  {getSiteEmail()}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-[#666666] mt-0.5 flex-shrink-0" />
                <a 
                  href={getSitePhoneTelHref()} 
                  className="text-[#666666] hover:text-accent-gold transition-colors focus:outline-none focus-visible:outline-none"
                >
                  {getSitePhoneDisplay()}
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/contact" className="focus:outline-none focus-visible:outline-none">
                <Button variant="outline" size="sm" className="w-full">
                  Contact opnemen
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E5E5E5] text-center">
          <p className="text-sm text-[#666666]">
            &copy; {new Date().getFullYear()} Feestmoment Verhuur. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  )
}
