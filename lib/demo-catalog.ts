export type CatalogCategory = {
  id: string
  name: string
  slug: string
  description: string
}

export type CatalogProduct = {
  id: string
  name: string
  slug: string
  description: string | null
  pricePerDay: number
  deposit: number
  images: string
  active: boolean
  createdAt: Date
  category: CatalogCategory
}

export const DEMO_CATEGORIES: CatalogCategory[] = [
  { id: "demo-cat-ballonnenbogen", name: "Ballonnenbogen", slug: "ballonnenbogen", description: "Prachtige ballonnenbogen voor elke gelegenheid" },
  { id: "demo-cat-decoratie", name: "Decoratie", slug: "decoratie", description: "Feestelijke decoraties en accessoires" },
  { id: "demo-cat-meubilair", name: "Meubilair", slug: "meubilair", description: "Statafels, stoelen en meer" },
  { id: "demo-cat-backdrops", name: "Backdrops", slug: "backdrops", description: "Fotowanden en achtergronden" },
]

const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&q=80&auto=format&fit=crop`

export const DEMO_PRODUCTS: CatalogProduct[] = [
  {
    id: "demo-1",
    name: "Ballonnenboog - Roze & Goud",
    slug: "ballonnenboog-roze-goud",
    description: "Prachtige ballonnenboog in roze en goudtinten, perfect voor verjaardagen en bruiloften.",
    pricePerDay: 75,
    deposit: 50,
    images: JSON.stringify([img("photo-1519167758481-83f550bb49b3")]),
    active: true,
    createdAt: new Date("2026-01-01"),
    category: DEMO_CATEGORIES[0],
  },
  {
    id: "demo-2",
    name: "Ballonnenboog - Wit & Champagne",
    slug: "ballonnenboog-wit-champagne",
    description: "Elegante ballonnenboog in witte en champagne tinten, ideaal voor bruiloften.",
    pricePerDay: 85,
    deposit: 50,
    images: JSON.stringify([img("photo-1464366400600-6398d0738f2d")]),
    active: true,
    createdAt: new Date("2026-01-02"),
    category: DEMO_CATEGORIES[0],
  },
  {
    id: "demo-3",
    name: "Statafel - Rond 120cm",
    slug: "statafel-rond-120cm",
    description: "Ronde statafel met een diameter van 120cm. Geschikt voor 8-10 personen.",
    pricePerDay: 15,
    deposit: 20,
    images: JSON.stringify([img("photo-1586023492125-27b2c045efd7")]),
    active: true,
    createdAt: new Date("2026-01-03"),
    category: DEMO_CATEGORIES[2],
  },
  {
    id: "demo-4",
    name: "Stoel - Chiavari Goud",
    slug: "stoel-chiavari-goud",
    description: "Elegante Chiavari stoel in goud, perfect voor bruiloften en formele events.",
    pricePerDay: 5,
    deposit: 10,
    images: JSON.stringify([img("photo-1519225429284-4863af193010")]),
    active: true,
    createdAt: new Date("2026-01-04"),
    category: DEMO_CATEGORIES[2],
  },
  {
    id: "demo-5",
    name: "Backdrop - Roze Bloesem",
    slug: "backdrop-roze-bloesem",
    description: "Romantische backdrop met roze bloemen, ideaal voor foto's en ceremonies.",
    pricePerDay: 95,
    deposit: 75,
    images: JSON.stringify([img("photo-1519741497674-611481863552")]),
    active: true,
    createdAt: new Date("2026-01-05"),
    category: DEMO_CATEGORIES[3],
  },
  {
    id: "demo-6",
    name: "Decoratie - Goud Ballonnen Set",
    slug: "decoratie-goud-ballonnen-set",
    description: "Set van 50 gouden ballonnen voor tafeldecoratie of fotoho's.",
    pricePerDay: 25,
    deposit: 15,
    images: JSON.stringify([img("photo-1530103862676-de8c9debad1d")]),
    active: true,
    createdAt: new Date("2026-01-06"),
    category: DEMO_CATEGORIES[1],
  },
]

export function getDemoProductBySlug(slug: string): CatalogProduct | null {
  return DEMO_PRODUCTS.find((p) => p.slug === slug && p.active) ?? null
}
