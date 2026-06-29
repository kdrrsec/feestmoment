"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice, calculateDays } from "@/lib/utils"
import { getSitePhoneDigits } from "@/lib/site-config"
import { useToast } from "@/components/ui/use-toast"

const MAX_RESERVATION_QTY = 99

interface ProductDetailClientProps {
  product: {
    id: string
    name: string
    slug: string
    pricePerDay: number
    deposit: number
  }
}

async function createWhatsappHold(payload: {
  productId: string
  startDate: string
  endDate: string
  quantity: number
  customerName?: string
  customerPhone?: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/reservations/whatsapp-hold", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const data = (await res.json().catch(() => ({}))) as { error?: string }
  if (!res.ok) {
    return {
      ok: false,
      error: data.error || "Deze periode kon niet worden vastgehouden.",
    }
  }
  return { ok: true }
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { toast } = useToast()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [reservationError, setReservationError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [availability, setAvailability] = useState<{
    available: boolean
    message: string
  } | null>(null)

  const runAvailabilityCheck = useCallback(async () => {
    if (!startDate || !endDate) {
      setAvailability(null)
      return
    }
    if (new Date(startDate) > new Date(endDate)) {
      setAvailability({
        available: false,
        message: "Einddatum moet op of na de startdatum liggen.",
      })
      return
    }
    setAvailabilityLoading(true)
    try {
      const res = await fetch("/api/cart/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          startDate,
          endDate,
          quantity,
        }),
      })
      const data = (await res.json()) as {
        available?: boolean
        message?: string
      }
      setAvailability({
        available: Boolean(data.available),
        message: data.message || (data.available ? "Beschikbaar" : "Niet beschikbaar."),
      })
    } catch {
      setAvailability({
        available: false,
        message: "Kon beschikbaarheid niet controleren. Probeer opnieuw.",
      })
    } finally {
      setAvailabilityLoading(false)
    }
  }, [product.id, startDate, endDate, quantity])

  useEffect(() => {
    if (!startDate || !endDate) {
      setAvailability(null)
      setAvailabilityLoading(false)
      return
    }
    const t = window.setTimeout(() => {
      void runAvailabilityCheck()
    }, 400)
    return () => window.clearTimeout(t)
  }, [startDate, endDate, quantity, runAvailabilityCheck])

  const days = startDate && endDate ? calculateDays(new Date(startDate), new Date(endDate)) : 0
  const datesComplete = Boolean(startDate && endDate)
  const periodBlocked = Boolean(datesComplete && availability && !availability.available)
  const awaitingAvailability =
    datesComplete && !availabilityLoading && availability === null
  const reserveDisabled =
    submitting || availabilityLoading || awaitingAvailability || periodBlocked
  const subtotal = days * product.pricePerDay * quantity
  const depositTotal = product.deposit * quantity
  const total = subtotal + depositTotal

  const openWhatsapp = () => {
    const whatsappNumber = getSitePhoneDigits()
    const productUrl = `${window.location.origin}/product/${product.slug}`
    const contactLine =
      customerName.trim() || customerPhone.trim()
        ? `\nMijn naam: ${customerName.trim() || "—"}\nTelefoon: ${customerPhone.trim() || "—"}`
        : ""
    const message = [
      "Hallo! Ik wil graag een reservering plaatsen:",
      "",
      `Product: ${product.name}`,
      `Link: ${productUrl}`,
      `Aantal: ${quantity}`,
      `Startdatum: ${startDate}`,
      `Einddatum: ${endDate}`,
      `Huurperiode: ${days} ${days === 1 ? "dag" : "dagen"}`,
      `Indicatief totaal: ${formatPrice(total)}`,
      contactLine,
    ].join("\n")

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.location.href = whatsappUrl
  }

  const handleReserveViaWhatsapp = async () => {
    if (!startDate || !endDate) {
      setReservationError("Selecteer een start- en einddatum voor je reservering.")
      return
    }
    setReservationError("")

    if (new Date(startDate) > new Date(endDate)) {
      toast({
        title: "Ongeldige datums",
        description: "De einddatum moet op of na de startdatum liggen.",
        variant: "destructive",
      })
      return
    }

    if (quantity < 1 || quantity > MAX_RESERVATION_QTY) {
      toast({
        title: "Ongeldige hoeveelheid",
        description: `Kies een hoeveelheid tussen 1 en ${MAX_RESERVATION_QTY}.`,
        variant: "destructive",
      })
      return
    }

    if (awaitingAvailability || availabilityLoading) {
      toast({
        title: "Even geduld",
        description: "Beschikbaarheid wordt gecontroleerd.",
        variant: "destructive",
      })
      return
    }

    if (periodBlocked) {
      toast({
        title: "Niet beschikbaar",
        description: availability?.message || "Kies andere datums of een lager aantal.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const held = await createWhatsappHold({
        productId: product.id,
        startDate,
        endDate,
        quantity,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
      })
      if (!held.ok) {
        toast({
          title: "Niet beschikbaar",
          description: held.error,
          variant: "destructive",
        })
        void runAvailabilityCheck()
        return
      }
      openWhatsapp()
    } catch {
      toast({
        title: "Fout",
        description: "Er ging iets mis. Probeer het opnieuw.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reserveer nu</CardTitle>
        <p className="text-xs text-secondary font-normal mt-2 leading-relaxed">
          Borg per product verschilt doorgaans tussen € 50 en € 200; hieronder zie je het bedrag voor dit artikel.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="quantity">Aantal</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max={MAX_RESERVATION_QTY}
            value={quantity}
            onChange={(e) => {
              setAvailability(null)
              setQuantity(parseInt(e.target.value) || 1)
            }}
            className="mt-2"
          />
          <p className="text-xs text-secondary mt-1">
            Reservering op aanvraag — bevestiging via WhatsApp.
          </p>
        </div>

        <div>
          <Label htmlFor="startDate">Startdatum</Label>
          <Input
            id="startDate"
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => {
              setAvailability(null)
              setStartDate(e.target.value)
              if (reservationError) setReservationError("")
            }}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="endDate">Einddatum</Label>
          <Input
            id="endDate"
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => {
              setAvailability(null)
              setEndDate(e.target.value)
              if (reservationError) setReservationError("")
            }}
            className="mt-2"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="custName">Je naam (optioneel)</Label>
            <Input
              id="custName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-2"
              placeholder="Voor in onze agenda"
              autoComplete="name"
            />
          </div>
          <div>
            <Label htmlFor="custPhone">Telefoon (optioneel)</Label>
            <Input
              id="custPhone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="mt-2"
              placeholder="06…"
              autoComplete="tel"
            />
          </div>
        </div>
        <p className="text-xs text-secondary">
          Zodra je op de knop drukt, wordt deze periode vastgehouden in onze agenda. Geen akkoord? Dan halen wij de blokkade weer weg.
        </p>

        {startDate && endDate && (
          <p
            className={`text-xs ${
              availabilityLoading || awaitingAvailability
                ? "text-muted-foreground"
                : availability?.available
                  ? "text-muted-foreground"
                  : "text-destructive font-medium"
            }`}
            role="status"
            aria-live="polite"
          >
            {availabilityLoading || awaitingAvailability
              ? "Beschikbaarheid controleren…"
              : availability
                ? availability.available
                  ? "Beschikbaar voor deze periode."
                  : availability.message
                : null}
          </p>
        )}

        {days > 0 && (
          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span>Huurperiode:</span>
              <span>{days} {days === 1 ? 'dag' : 'dagen'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Subtotaal ({quantity}x {formatPrice(product.pricePerDay)}/dag):</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {depositTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span>Borg ({quantity}x {formatPrice(product.deposit)}):</span>
                <span>{formatPrice(depositTotal)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Totaal:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        )}

        <Button
          onClick={() => void handleReserveViaWhatsapp()}
          disabled={reserveDisabled}
          className="whatsapp-reserve-btn w-full !bg-green-600 hover:!bg-green-500 active:!bg-green-600 focus-visible:!bg-green-600 hover:opacity-90 !text-white transition-all duration-200 cursor-pointer"
          size="lg"
        >
          {submitting
            ? "Agenda bijwerken…"
            : availabilityLoading || awaitingAvailability
              ? "Controleren…"
              : periodBlocked
                ? "Niet beschikbaar"
                : "Plaats je reservering"}
        </Button>
        {reservationError && (
          <div
            role="alert"
            className="reservation-inline-error mt-2 rounded-lg px-3 py-2 text-sm font-medium"
          >
            {reservationError}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
