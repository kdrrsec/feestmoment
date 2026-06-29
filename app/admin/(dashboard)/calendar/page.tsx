import { prisma } from "@/lib/prisma"
import { AdminReservationForm } from "@/components/admin/admin-reservation-form"
import { AdminReservationCard } from "@/components/admin/admin-reservation-card"

async function getReservations() {
  try {
    return await prisma.reservation.findMany({
      include: { product: true },
      orderBy: { startDate: "asc" },
    })
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

async function getProductsForForm() {
  try {
    return await prisma.product.findMany({
      where: { active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    })
  } catch {
    return []
  }
}

export default async function AdminCalendarPage() {
  const [reservations, products] = await Promise.all([getReservations(), getProductsForForm()])

  return (
    <div className="bg-white">
      <h1 className="text-3xl font-serif font-bold mb-2 text-[#111111]">Kalender</h1>
      <p className="text-sm text-[#666666] mb-8">
        Alle geblokkeerde periodes (WhatsApp via site of handmatig). Verwijder een regel om de plek weer vrij te geven.
      </p>

      <AdminReservationForm products={products} />

      <div className="space-y-4">
        {reservations.length === 0 ? (
          <p className="text-[#666666] py-8 text-center border border-dashed border-[#E5E5E5] rounded-lg">
            Nog geen reserveringen in de agenda.
          </p>
        ) : (
          reservations.map((r) => (
            <AdminReservationCard
              key={r.id}
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
    </div>
  )
}
