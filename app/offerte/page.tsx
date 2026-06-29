"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight } from "lucide-react"

export default function OffertePage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    location: "",
    eventType: "",
    message: "",
    budget: "",
    colorTheme: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "offerte" }),
      })

      if (!response.ok) {
        throw new Error("Verzenden mislukt")
      }

      toast({
        title: "Offerte aanvraag verzonden",
        description: "We reageren binnen 24 uur op uw aanvraag.",
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        eventDate: "",
        location: "",
        eventType: "",
        message: "",
        budget: "",
        colorTheme: "",
      })
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-white border-b border-[#E5E5E5]">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-[#111111]">
              Offerte aanvragen
            </h1>
            <p className="text-lg md:text-xl text-[#666666]">
              Voor maatwerk ballonnenbogen, decoraties of grote bestellingen kunt u hier een offerte aanvragen. 
              We reageren binnen 24 uur.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <Card className="border-[#E5E5E5]">
            <CardHeader>
              <CardTitle className="text-[#111111]">Uw gegevens</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-[#111111]">Naam *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="mt-2 border-[#E5E5E5]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-[#111111]">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="mt-2 border-[#E5E5E5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-[#111111]">Telefoon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="mt-2 border-[#E5E5E5]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="eventDate" className="text-[#111111]">Datum evenement</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="mt-2 border-[#E5E5E5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="location" className="text-[#111111]">Locatie</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Stad of postcode"
                      className="mt-2 border-[#E5E5E5]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="eventType" className="text-[#111111]">Type event</Label>
                    <select
                      id="eventType"
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-accent-gold"
                    >
                      <option value="">Selecteer type</option>
                      <option value="bruiloft">Bruiloft</option>
                      <option value="verjaardag">Verjaardag</option>
                      <option value="bedrijfsfeest">Bedrijfsfeest</option>
                      <option value="baby-shower">Baby Shower</option>
                      <option value="overig">Overig</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="budget" className="text-[#111111]">Budget (optioneel)</Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="Bijv. €500 - €1000"
                      className="mt-2 border-[#E5E5E5]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="colorTheme" className="text-[#111111]">Kleurthema (optioneel)</Label>
                    <Input
                      id="colorTheme"
                      value={formData.colorTheme}
                      onChange={(e) => setFormData({ ...formData, colorTheme: e.target.value })}
                      placeholder="Bijv. Roze & Goud"
                      className="mt-2 border-[#E5E5E5]"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-[#111111]">Bericht *</Label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="mt-2 flex min-h-[120px] w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-[#111111] ring-offset-background placeholder:text-[#666666] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Beschrijf uw wensen en eventuele specifieke eisen..."
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={loading} className="w-full" size="lg">
                    {loading ? "Verzenden..." : "Verstuur aanvraag"}
                    {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                  <p className="text-sm text-[#666666] text-center mt-4">
                    We reageren binnen 24 uur op uw aanvraag
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
