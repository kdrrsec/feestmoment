import Stripe from "stripe"

let stripeSingleton: Stripe | null | undefined

/**
 * Stripe is optioneel: zonder geldige STRIPE_SECRET_KEY wordt null teruggegeven
 * (build/dev lopen niet vast; checkout geeft een duidelijke fout).
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key || key === "sk_test_placeholder") {
    return null
  }
  if (stripeSingleton === undefined) {
    stripeSingleton = new Stripe(key, {
      apiVersion: "2023-10-16",
      typescript: true,
    })
  }
  return stripeSingleton
}

export function isStripeEnabled(): boolean {
  return getStripe() !== null
}
