import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Winkelmand",
  description: "Controleer uw selectie en rond uw reservering af.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/winkelmand" },
}

export default function WinkelmandLayout({ children }: { children: React.ReactNode }) {
  return children
}

