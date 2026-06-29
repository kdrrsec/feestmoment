import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

type Db = Prisma.TransactionClient | typeof prisma

/**
 * Strikte kalender (standaard aan): zodra er voor dit product een overlappende
 * reservering bestaat, is de periode voor nieuwe klanten vol — ongeacht stockQty.
 * Zet RESERVATION_STRICT_CALENDAR=false om meerdere parallelle boekingen toe
 * te staan tot aan voorraadlimiet (oude gedrag).
 */
export function isStrictReservationCalendar(): boolean {
  return process.env.RESERVATION_STRICT_CALENDAR !== "false"
}

/** Som van gereserveerde stuks voor overlappende reserveringen (of vol bij strikte modus). */
export async function getReservedQuantityInRange(
  db: Db,
  productId: string,
  rangeStart: Date,
  rangeEnd: Date,
  stockQty: number
): Promise<number> {
  const overlapping = await db.reservation.findMany({
    where: {
      productId,
      AND: [{ startDate: { lte: rangeEnd } }, { endDate: { gte: rangeStart } }],
    },
    select: { quantity: true },
  })
  const total = overlapping.reduce((sum, r) => sum + r.quantity, 0)
  if (isStrictReservationCalendar() && overlapping.length > 0) {
    return stockQty
  }
  return total
}

export type AvailabilityResult = {
  available: boolean
  stockQty: number
  reserved: number
  remaining: number
  message: string
}

export function buildAvailabilityResult(
  stockQty: number,
  reserved: number,
  requestedQty: number
): AvailabilityResult {
  const remaining = Math.max(0, stockQty - reserved)
  const available = remaining >= requestedQty
  const message = available
    ? "Beschikbaar"
    : remaining === 0
      ? "Niet beschikbaar: dit product is al gereserveerd in deze periode."
      : `Niet beschikbaar. Slechts ${remaining} ${remaining === 1 ? "stuk" : "stuks"} beschikbaar.`
  return { available, stockQty, reserved, remaining, message }
}

export async function checkProductAvailability(
  db: Db,
  productId: string,
  rangeStart: Date,
  rangeEnd: Date,
  requestedQty: number,
  stockQty: number
): Promise<AvailabilityResult> {
  const reserved = await getReservedQuantityInRange(
    db,
    productId,
    rangeStart,
    rangeEnd,
    stockQty
  )
  return buildAvailabilityResult(stockQty, reserved, requestedQty)
}
