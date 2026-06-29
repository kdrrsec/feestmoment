import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingWhatsAppButton } from "@/components/floating-whatsapp-button"
import { absoluteUrl, defaultSeoDescription, getSiteUrl, siteName } from "@/lib/seo"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const siteUrl = (() => {
  try {
    return new URL(getSiteUrl())
  } catch {
    return new URL("http://localhost:4001")
  }
})()

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: `${siteName} - Feest- en eventartikelen verhuur`,
    template: `%s | ${siteName}`,
  },
  description: defaultSeoDescription,
  keywords: [
    "feestartikelen verhuur",
    "ballonnenboog huren",
    "event decoratie",
    "meubilair verhuur",
    "offerte feestdecoratie",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/favicon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: `${siteName} - Feest- en eventartikelen verhuur`,
    description: defaultSeoDescription,
    type: "website",
    locale: "nl_NL",
    siteName,
    url: siteUrl.href,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Feest- en eventartikelen verhuur`,
    description: defaultSeoDescription,
    images: ["/logo.png"],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#organisatie"),
    name: siteName,
    url: getSiteUrl(),
    image: absoluteUrl("/logo.png"),
    email: process.env.NEXT_PUBLIC_SITE_EMAIL?.trim() || "info@feestmomentverhuur.nl",
    telephone: process.env.NEXT_PUBLIC_SITE_PHONE?.trim() || "+31612345678",
    areaServed: "NL",
    priceRange: "EUR",
    sameAs: [
      process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL?.trim(),
      process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL?.trim(),
    ].filter(Boolean),
  }

  return (
    <html lang="nl" className={`${inter.variable} ${playfair.variable}`} style={{ WebkitTapHighlightColor: 'transparent' }}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-white" style={{ WebkitTapHighlightColor: 'transparent', backgroundColor: '#ffffff' }}>
        <Navbar />
        <main className="min-h-screen bg-white">{children}</main>
        <Footer />
        <FloatingWhatsAppButton />
        <Toaster />
      </body>
    </html>
  )
}
