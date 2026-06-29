import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Neem contact op met Feestmoment Verhuur voor vragen over feestdecoratie, levering en beschikbaarheid.",
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}

