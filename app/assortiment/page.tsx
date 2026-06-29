import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { SearchBar } from "@/components/search-bar"
import { getAssortiment } from "@/lib/catalog"
import { Suspense } from "react"

/** Zoek- en filterquery maakt deze route dynamisch (geen statische pre-render). */
export const dynamic = "force-dynamic"

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  const category = typeof searchParams.categorie === "string" ? searchParams.categorie : undefined
  const search = typeof searchParams.zoek === "string" ? searchParams.zoek : undefined
  const minPrice = typeof searchParams.minPrijs === "string" ? parseFloat(searchParams.minPrijs) : undefined
  const maxPrice = typeof searchParams.maxPrijs === "string" ? parseFloat(searchParams.maxPrijs) : undefined
  const sortBy = typeof searchParams.sorteer === "string" ? searchParams.sorteer : "nieuwste"

  return getAssortiment({
    category,
    search,
    minPrice,
    maxPrice,
    sortBy,
  })
}

export default async function AssortimentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { products, categories } = await getProducts(searchParams)
  const activeCategory = typeof searchParams.categorie === 'string' ? searchParams.categorie : undefined
  const activeSearch = typeof searchParams.zoek === 'string' ? searchParams.zoek : undefined

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-white border-b border-[#E5E5E5]">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-[#111111]">
              Ons Assortiment
            </h1>
            <p className="text-lg md:text-xl text-[#666666]">
              Ontdek onze collectie feest- en eventartikelen. Van ballonnenbogen tot meubilair, 
              alles voor uw perfecte feestmoment.
            </p>
          </div>
        </div>
      </section>

      <SearchBar initialSearch={activeSearch} searchParams={searchParams} />

      {/* Main Content */}
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Suspense fallback={
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <p className="text-[#666666]">Filters laden...</p>
              </div>
            }>
              <ProductFilters categories={categories} searchParams={searchParams} />
            </Suspense>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-12 text-center">
                <p className="text-xl text-[#666666] mb-2">Geen producten gevonden</p>
                <p className="text-[#666666]">
                  Probeer andere filters of zoektermen te gebruiken.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-[#666666]">
                    {products.length} {products.length === 1 ? 'product' : 'producten'} gevonden
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
