"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"
import {
  getSitePhoneDigits,
  getSitePhoneTelHref,
  getSitePhoneDisplay,
  getSiteEmail,
  getSiteEmailMailto,
} from "@/lib/site-config"

export default function ContactPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          source: "contact",
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Verzenden mislukt")
      }

      toast({
        title: "Bericht verzonden",
        description: "We nemen zo spoedig mogelijk contact met u op.",
      })
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (err) {
      toast({
        title: "Niet verzonden",
        description: err instanceof Error ? err.message : "Probeer het later opnieuw.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const whatsappNumber = getSitePhoneDigits()
  const whatsappMessage = encodeURIComponent("Hallo, ik heb een vraag over Feestmoment Verhuur.")

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-white border-b border-[#E5E5E5]">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-[#111111]">
              Neem contact op
            </h1>
            <p className="text-lg md:text-xl text-[#666666]">
              Heeft u vragen? Neem gerust contact met ons op. We helpen u graag verder.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <CardTitle className="text-[#111111]">Contactgegevens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#F8F8F8] flex items-center justify-center text-accent-gold">
                      <Mail className="h-5 w-5 !stroke-accent-gold !fill-accent-gold" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-[#111111]">Email</p>
                    <a 
                      href={getSiteEmailMailto()} 
                      className="text-[#666666] hover:text-accent-gold transition-colors"
                    >
                      {getSiteEmail()}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#F8F8F8] flex items-center justify-center text-accent-gold">
                      <Phone className="h-5 w-5 !stroke-accent-gold !fill-accent-gold" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-[#111111]">Telefoon</p>
                    <a 
                      href={getSitePhoneTelHref()} 
                      className="text-[#666666] hover:text-accent-gold transition-colors"
                    >
                      {getSitePhoneDisplay()}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#F8F8F8] flex items-center justify-center text-accent-gold">
                      <MapPin className="h-5 w-5 !stroke-accent-gold !fill-accent-gold" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-[#111111]">Locatie</p>
                    <p className="text-[#666666]">
                      Bezorggebied: Gelderland
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#F8F8F8] flex items-center justify-center text-accent-gold">
                      <Clock className="h-5 w-5 !stroke-accent-gold !fill-accent-gold" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-[#111111]">Openingstijden</p>
                    <p className="text-[#666666] text-sm">
                      Ma - Vr: 09:00 - 18:00<br />
                      Za: 10:00 - 18:00<br />
                      Zo: 10:00 - 18:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Button */}
            <div className="pt-6">
              <Link
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  className="whatsapp-reserve-btn w-full !bg-green-600 hover:!bg-green-500 active:!bg-green-600 focus-visible:!bg-green-600 hover:opacity-90 !text-white transition-all duration-200 cursor-pointer"
                  size="lg"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Stuur WhatsApp bericht
                </Button>
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <CardTitle className="text-[#111111]">Stuur een bericht</CardTitle>
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

                  <div>
                    <Label htmlFor="subject" className="text-[#111111]">Onderwerp *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="mt-2 border-[#E5E5E5]"
                    />
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
                      placeholder="Uw bericht..."
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full" size="lg">
                    {loading ? "Verzenden..." : "Verstuur bericht"}
                    {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bezorggebied Section */}
        <div className="mt-12">
          <Card className="border-[#E5E5E5]">
            <CardContent className="pt-8 pb-8">
              <div className="text-center max-w-3xl mx-auto">
                <MapPin className="h-12 w-12 text-[#111111] mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-bold mb-4 text-[#111111]">Bezorggebied</h3>
                <p className="text-[#666666] leading-relaxed">
                  Wij bezorgen in heel Gelderland. Voor bezorging buiten Gelderland kunnen we in overleg
                  een passende oplossing zoeken; daarbij kunnen extra reis- of leverkosten gelden.
                  Neem gerust contact met ons op via WhatsApp of het contactformulier, dan bespreken we
                  de mogelijkheden en maken we een heldere prijsafspraak voor uw locatie.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
