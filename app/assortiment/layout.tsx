import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Assortiment feestartikelen",
  description:
    "Bekijk ons assortiment met feest- en eventartikelen. Filter op categorie en prijs en vraag direct een offerte aan.",
  alternates: {
    canonical: "/assortiment",
  },
}

export default function AssortimentLayout({ children }: { children: React.ReactNode }) {
  return children
}

