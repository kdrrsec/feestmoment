"use client"

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Filter } from "lucide-react"

interface ProductFiltersProps {
  categories: Array<{ id: string; name: string; slug: string }>
  searchParams: { [key: string]: string | string[] | undefined }
}

export function ProductFilters({ categories, searchParams }: ProductFiltersProps) {
  const router = useRouter()

  const slugsWithoutCount = new Set(["backdrops", "ballonnenbogen", "decoratie"])

  const getCategoryLabel = (slug: string, name: string) => {
    // Soms worden aantallen in de categorie-naam mee opgeslagen, bv. "Backdrops (12)".
    // Voor deze 3 categorieën willen we dat weghalen in de UI.
    if (!slugsWithoutCount.has(slug)) return name

    return name.replace(/\s*\(\s*\d+\s*\)\s*$/g, "").trim()
  }

  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams()
    // Preserve existing params
    Object.entries(searchParams).forEach(([k, v]) => {
      if (k !== key && v && typeof v === 'string') {
        params.set(k, v)
      }
    })
    if (value) {
      params.set(key, value)
    }
    router.push(`/assortiment?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/assortiment')
  }

  const hasActiveFilters = Object.keys(searchParams).filter(k => k !== 'sorteer').length > 0
  const activeCategory = typeof searchParams.categorie === 'string' ? searchParams.categorie : undefined

  return (
    <Card className="sticky top-28 border-[#E5E5E5]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#111111]" />
            <CardTitle className="text-[#111111]">Filters</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sorteren */}
        <div>
          <Label className="text-[#111111]">Sorteren op</Label>
          <select
            value={typeof searchParams.sorteer === 'string' ? searchParams.sorteer : 'nieuwste'}
            onChange={(e) => updateSearchParams('sorteer', e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-accent-gold"
          >
            <option value="nieuwste">Nieuwste eerst</option>
            <option value="prijs-laag">Prijs: Laag naar hoog</option>
            <option value="prijs-hoog">Prijs: Hoog naar laag</option>
            <option value="naam">Naam: A-Z</option>
          </select>
        </div>

        {/* Categorie */}
        <div>
          <Label className="text-[#111111]">Categorie</Label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer py-1">
              <input
                type="radio"
                name="categorie"
                checked={!activeCategory}
                onChange={() => updateSearchParams('categorie', null)}
                className="rounded border-[#E5E5E5] text-accent-gold focus:ring-accent-gold"
              />
              <span className="text-sm text-[#111111]">Alle categorieën</span>
            </label>
            {categories.map((category) => {
              const isSelected = activeCategory === category.slug
              return (
                <label key={category.id} className="flex items-center space-x-2 cursor-pointer py-1">
                  <input
                    type="radio"
                    name="categorie"
                    checked={isSelected}
                    onChange={() => updateSearchParams('categorie', isSelected ? null : category.slug)}
                    className="rounded border-[#E5E5E5] text-accent-gold focus:ring-accent-gold"
                  />
                  <span className="text-sm text-[#111111]">{getCategoryLabel(category.slug, category.name)}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Prijs Range */}
        <div>
          <Label className="text-[#111111]">Prijs per dag</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min €"
              min="0"
              defaultValue={typeof searchParams.minPrijs === 'string' ? searchParams.minPrijs : ''}
              onChange={(e) => {
                const value = e.target.value.trim()
                updateSearchParams('minPrijs', value || null)
              }}
              className="text-sm border-[#E5E5E5]"
            />
            <Input
              type="number"
              placeholder="Max €"
              min="0"
              defaultValue={typeof searchParams.maxPrijs === 'string' ? searchParams.maxPrijs : ''}
              onChange={(e) => {
                const value = e.target.value.trim()
                updateSearchParams('maxPrijs', value || null)
              }}
              className="text-sm border-[#E5E5E5]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
