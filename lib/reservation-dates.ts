/** Parse YYYY-MM-DD als lokale kalenderdag (middag) voor consistente opslag. */
export function parseDateInputLocal(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map((n) => parseInt(n, 10))
  if (!y || !m || !d) throw new Error("Ongeldige datum")
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

export function isValidYmd(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s)
}

/** YYYY-MM-DD als lokale dag; anders Date.parse (bv. ISO). */
export function parseReservationRangeDate(value: string): Date | null {
  if (isValidYmd(value)) return parseDateInputLocal(value)
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}
