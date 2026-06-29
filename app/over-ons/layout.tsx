import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "Lees meer over Feestmoment Verhuur, onze werkwijze en waarom klanten voor onze feest- en eventservice kiezen.",
  alternates: {
    canonical: "/over-ons",
  },
}

export default function OverOnsLayout({ children }: { children: React.ReactNode }) {
  return children
}

