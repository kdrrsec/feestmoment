import type { Metadata } from "next"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Bedankt voor uw bestelling",
  description: "Uw bestelling is ontvangen. We nemen contact op voor de verdere afhandeling.",
  alternates: { canonical: "/bedankt" },
  robots: { index: false, follow: false },
}

export default function BedanktPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
          <CheckCircle className="h-12 w-12 text-black" />
        </div>
        <h1 className="text-4xl font-serif font-bold mb-4">
          Bedankt voor uw bestelling!
        </h1>
        <p className="text-lg text-secondary mb-8">
          Uw betaling is succesvol verwerkt. U ontvangt binnenkort een bevestigingsemail.
        </p>

        <Card>
          <CardContent className="pt-6">
            <p className="text-secondary mb-4">
              Wij hebben uw reservering ontvangen en zullen deze zo spoedig mogelijk bevestigen.
            </p>
            <p className="text-sm text-secondary mb-6">
              Heeft u vragen? Neem gerust contact met ons op via info@feestmomentverhuur.nl
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assortiment">
                <Button variant="outline">Bekijk meer producten</Button>
              </Link>
              <Link href="/">
                <Button>Terug naar home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
