"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

type ProductOption = { id: string; name: string }

export function AdminReservationForm({ products }: { products: ProductOption[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [productId, setProductId] = useState(products[0]?.id ?? "")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [notes, setNotes] = useState("")

  const today = new Date().toISOString().split("T")[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId || !startDate || !endDate) {
      toast({ title: "Vul alles in", description: "Product, start- en einddatum zijn verplicht.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          startDate,
          endDate,
          quantity,
          customerName: customerName.trim() || null,
          customerPhone: customerPhone.trim() || null,
          notes: notes.trim() || null,
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Opslaan mislukt")
      }
      toast({ title: "Reservering toegevoegd", description: "Zichtbaar in kalender en bij WhatsApp-reserveringen." })
      setStartDate("")
      setEndDate("")
      setCustomerName("")
      setCustomerPhone("")
      setNotes("")
      setQuantity(1)
      router.refresh()
    } catch (err: unknown) {
      toast({
        title: "Fout",
        description: err instanceof Error ? err.message : "Er ging iets mis.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (products.length === 0) {
    return null
  }

  return (
    <Card className="mb-8 border-[#E5E5E5]">
      <CardHeader>
        <CardTitle className="text-lg text-[#111111]">Handmatige reservering</CardTitle>
        <CardDescription>
          Voor een appje of telefoon buiten de site om: zo blokkeer je dezelfde plek in de agenda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3">
            <Label htmlFor="res-product">Product</Label>
            <select
              id="res-product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="res-start">Startdatum</Label>
            <Input id="res-start" type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="res-end">Einddatum</Label>
            <Input id="res-end" type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="res-qty">Aantal</Label>
            <Input
              id="res-qty"
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="res-name">Naam (optioneel)</Label>
            <Input id="res-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-2" placeholder="Klant" />
          </div>
          <div>
            <Label htmlFor="res-phone">Telefoon (optioneel)</Label>
            <Input id="res-phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="mt-2" placeholder="06…" />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <Label htmlFor="res-notes">Notitie (optioneel)</Label>
            <Input id="res-notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2" placeholder="Bv. via WhatsApp, nog te bevestigen" />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Opslaan…" : "Reservering toevoegen"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
