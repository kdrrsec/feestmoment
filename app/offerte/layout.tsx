import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Offerte aanvragen",
  description:
    "Vraag eenvoudig een offerte aan voor ballonnenbogen, decoraties en feestartikelen op maat.",
  alternates: {
    canonical: "/offerte",
  },
}

export default function OfferteLayout({ children }: { children: React.ReactNode }) {
  return children
}

