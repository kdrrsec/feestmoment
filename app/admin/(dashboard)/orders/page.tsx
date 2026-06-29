import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminReservationCard } from "@/components/admin/admin-reservation-card"
import Link from "next/link"

async function getOrders() {
  try {
    return await prisma.rentalOrder.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

async function getReservations() {
  try {
    return await prisma.reservation.findMany({
      include: { product: true },
      orderBy: { startDate: "desc" },
    })
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

export default async function AdminOrdersPage() {
  const [orders, reservations] = await Promise.all([getOrders(), getReservations()])

  const statusColors: Record<string, string> = {
    PENDING: "bg-gray-100 text-gray-700 border border-gray-300",
    PAID: "bg-green-100 text-green-800",
    CONFIRMED: "bg-gray-100 text-gray-800",
    COMPLETED: "bg-gray-100 text-gray-800",
    CANCELLED: "bg-red-100 text-red-800",
  }

  return (
    <div className="bg-white space-y-12">
      <section>
        <h1 className="text-3xl font-serif font-bold mb-2 text-[#111111]">Bestellingen</h1>
        <p className="text-sm text-[#666666] mb-6">
          Betaalde / checkout-bestellingen. WhatsApp-blokkades staan hieronder bij reserveringen.
        </p>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-[#666666] py-6">Nog geen bestellingen via de site.</p>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="bg-white border border-[#E5E5E5] shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-[#111111]">Order #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-[#666666] mt-1">
                        {order.customerName} - {order.customerEmail}
                      </p>
                    </div>
                    <Badge className={statusColors[order.status] || ""}>{order.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-[#666666]">Periode</p>
                      <p className="font-semibold text-[#111111]">
                        {formatDate(order.startDate)} - {formatDate(order.endDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#666666]">Bezorgmethode</p>
                      <p className="font-semibold text-[#111111]">{order.deliveryType}</p>
                    </div>
                    {order.deliveryAddress && (
                      <div>
                        <p className="text-sm text-[#666666]">Adres</p>
                        <p className="font-semibold text-[#111111]">
                          {order.deliveryAddress}, {order.deliveryZipCode} {order.deliveryCity}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#E5E5E5] pt-4">
                    <p className="text-sm font-semibold mb-2 text-[#111111]">Producten:</p>
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li key={item.id} className="text-sm text-[#666666]">
                          {item.quantity}x {item.product.name} - {formatPrice(item.lineTotal)}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex justify-between items-center pt-4 border-t border-[#E5E5E5]">
                      <div>
                        <p className="text-sm text-[#666666]">Subtotaal: {formatPrice(order.subtotal)}</p>
                        {order.deposit > 0 && (
                          <p className="text-sm text-[#666666]">Borg: {formatPrice(order.deposit)}</p>
                        )}
                        {order.deliveryFee > 0 && (
                          <p className="text-sm text-[#666666]">Bezorgkosten: {formatPrice(order.deliveryFee)}</p>
                        )}
                      </div>
                      <p className="text-lg font-semibold">Totaal: {formatPrice(order.total)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-serif font-bold mb-2 text-[#111111]">Reserveringen &amp; agenda</h2>
        <p className="text-sm text-[#666666] mb-4">
          Zelfde lijst als onder <Link href="/admin/calendar" className="text-[#C6A76B] underline font-medium">Kalender</Link>.
          Verwijder een regel als er geen akkoord komt — de periode is dan weer vrij.
        </p>
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <p className="text-[#666666]">Geen openstaande reserveringen.</p>
          ) : (
            reservations.map((r) => (
              <AdminReservationCard
                key={r.id}
                compact
                r={{
                  id: r.id,
                  startDate: r.startDate,
                  endDate: r.endDate,
                  quantity: r.quantity,
                  source: r.source,
                  customerName: r.customerName,
                  customerPhone: r.customerPhone,
                  notes: r.notes,
                  createdAt: r.createdAt,
                  product: {
                    name: r.product.name,
                    pricePerDay: r.product.pricePerDay,
                    deposit: r.product.deposit,
                  },
                }}
              />
            ))
          )}
        </div>
      </section>
    </div>
  )
}
