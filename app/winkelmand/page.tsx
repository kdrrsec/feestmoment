"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/utils"
import { Trash2, ShoppingBag } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface CartItem {
  productId: string
  productSlug: string
  productName: string
  quantity: number
  startDate: string
  endDate: string
  pricePerDay: number
  deposit: number
  subtotal: number
  depositTotal: number
  total: number
}

export default function WinkelmandPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    deliveryType: "PICKUP" as "PICKUP" | "DELIVERY" | "SETUP",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryZipCode: "",
  })

  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index)
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
    toast({
      title: "Verwijderd",
      description: "Product verwijderd uit winkelmand.",
    })
  }

  const totalSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const totalDeposit = cart.reduce((sum, item) => sum + item.depositTotal, 0)
  const deliveryFee = customerData.deliveryType !== "PICKUP" ? 25 : 0
  const grandTotal = totalSubtotal + totalDeposit + deliveryFee

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Winkelmand is leeg",
        description: "Voeg producten toe aan uw winkelmand.",
        variant: "destructive",
      })
      return
    }

    if (!customerData.name || !customerData.email || !customerData.phone) {
      toast({
        title: "Vul alle verplichte velden in",
        description: "Naam, email en telefoon zijn verplicht.",
        variant: "destructive",
      })
      return
    }

    if (customerData.deliveryType !== "PICKUP" && !customerData.deliveryAddress) {
      toast({
        title: "Vul bezorgadres in",
        description: "Bij bezorging is een adres verplicht.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customer: customerData,
          totals: {
            subtotal: totalSubtotal,
            deposit: totalDeposit,
            deliveryFee,
            total: grandTotal,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Checkout mislukt")
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error: any) {
      toast({
        title: "Fout",
        description: error.message || "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto text-secondary mb-4" />
          <h1 className="text-3xl font-serif font-bold mb-4">Uw winkelmand is leeg</h1>
          <p className="text-secondary mb-8">Voeg producten toe aan uw winkelmand om verder te gaan.</p>
          <Button onClick={() => router.push("/assortiment")}>
            Assortiment
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-serif font-bold mb-8">Winkelmand</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-2">{item.productName}</h3>
                    <p className="text-sm text-secondary mb-2">
                      Aantal: {item.quantity}
                    </p>
                    <p className="text-sm text-secondary mb-2">
                      Periode: {new Date(item.startDate).toLocaleDateString("nl-NL")} - {new Date(item.endDate).toLocaleDateString("nl-NL")}
                    </p>
                    <p className="text-sm font-semibold mt-2">
                      {formatPrice(item.total)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Afrekenen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Naam *</Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefoon *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="deliveryType">Bezorgmethode</Label>
                <select
                  id="deliveryType"
                  value={customerData.deliveryType}
                  onChange={(e) => setCustomerData({ ...customerData, deliveryType: e.target.value as any })}
                  className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="PICKUP">Ophalen</option>
                  <option value="DELIVERY">Bezorgen</option>
                  <option value="SETUP">Bezorgen + Opbouw</option>
                </select>
              </div>

              {customerData.deliveryType !== "PICKUP" && (
                <>
                  <div>
                    <Label htmlFor="deliveryAddress">Adres *</Label>
                    <Input
                      id="deliveryAddress"
                      value={customerData.deliveryAddress}
                      onChange={(e) => setCustomerData({ ...customerData, deliveryAddress: e.target.value })}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="deliveryZipCode">Postcode *</Label>
                      <Input
                        id="deliveryZipCode"
                        value={customerData.deliveryZipCode}
                        onChange={(e) => setCustomerData({ ...customerData, deliveryZipCode: e.target.value })}
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryCity">Plaats *</Label>
                      <Input
                        id="deliveryCity"
                        value={customerData.deliveryCity}
                        onChange={(e) => setCustomerData({ ...customerData, deliveryCity: e.target.value })}
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotaal:</span>
                  <span>{formatPrice(totalSubtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Borg:</span>
                  <span>{formatPrice(totalDeposit)}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Bezorgkosten:</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Totaal:</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <p className="text-sm text-[#666666] text-center">
                  Betalingen zijn momenteel niet geactiveerd. Neem contact met ons op voor afhandeling.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/contact")}
                  className="w-full"
                  size="lg"
                >
                  Contact opnemen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
