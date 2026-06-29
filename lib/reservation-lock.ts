import { Prisma } from "@prisma/client"

/** Voorkomt race conditions: twee gelijktijdige reserveringen voor hetzelfde product. */
export async function lockProductRows(
  tx: Prisma.TransactionClient,
  productIds: string[]
): Promise<void> {
  const sorted = [...new Set(productIds)].sort()
  for (const id of sorted) {
    await tx.$executeRaw(Prisma.sql`SELECT id FROM "Product" WHERE id = ${id} FOR UPDATE`)
  }
}
