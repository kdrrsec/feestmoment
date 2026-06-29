import { formatDate, formatPrice } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteReservationButton } from "@/components/admin/delete-reservation-button"

const sourceLabel: Record<string, string> = {
  WHATSAPP: "Website / WhatsApp",
  ADMIN: "Handmatig",
  ORDER: "Via bestelling",
}

export type AdminReservationRow = {
  id: string
  startDate: Date
  endDate: Date
  quantity: number
  source: string
  customerName: string | null
  customerPhone: string | null
  notes: string | null
  createdAt: Date
  product: { name: string; pricePerDay: number; deposit: number }
}

export function AdminReservationCard({ r, compact }: { r: AdminReservationRow; compact?: boolean }) {
  const src = sourceLabel[r.source] || r.source

  return (
    <Card className="bg-white border border-[#E5E5E5] shadow-sm">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="text-base text-[#111111]">{r.product.name}</CardTitle>
          <p className="text-xs text-[#888888] mt-1">{src}</p>
          <p className="text-[11px] leading-snug text-[#999999] mt-1.5">
            {formatPrice(r.product.pricePerDay)}/dag
            {r.product.deposit > 0 && (
              <>
                <span className="mx-1.5 text-[#CCCCCC]">·</span>
                borg {formatPrice(r.product.deposit)}
              </>
            )}
          </p>
        </div>
        <DeleteReservationButton reservationId={r.id} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={`grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 md:grid-cols-3"}`}>
          <div>
            <p className="text-sm text-[#666666]">Start</p>
            <p className="font-semibold text-[#111111]">{formatDate(r.startDate)}</p>
          </div>
          <div>
            <p className="text-sm text-[#666666]">Einde</p>
            <p className="font-semibold text-[#111111]">{formatDate(r.endDate)}</p>
          </div>
          <div>
            <p className="text-sm text-[#666666]">Aantal</p>
            <p className="font-semibold text-[#111111]">{r.quantity}</p>
          </div>
          {!compact && (
            <div>
              <p className="text-sm text-[#666666]">Aangemaakt</p>
              <p className="font-semibold text-[#111111]">{formatDate(r.createdAt)}</p>
            </div>
          )}
        </div>
        {(r.customerName || r.customerPhone) && (
          <p className="text-sm text-[#333333]">
            {r.customerName && <span className="font-medium">{r.customerName}</span>}
            {r.customerName && r.customerPhone && " · "}
            {r.customerPhone && <span>{r.customerPhone}</span>}
          </p>
        )}
        {r.notes && <p className="text-sm text-[#666666] whitespace-pre-line border-t border-[#E5E5E5] pt-3">{r.notes}</p>}
      </CardContent>
    </Card>
  )
}
