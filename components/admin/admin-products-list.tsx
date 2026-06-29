"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { DeleteProductButton } from "@/components/admin/delete-product-button"
import { Pencil, Search } from "lucide-react"

export type AdminProductRow = {
  id: string
  name: string
  slug: string
  pricePerDay: number
  deposit: number
  stockQty: number
  active: boolean
  category: { name: string }
}

export function AdminProductsList({ products }: { products: AdminProductRow[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q)
    )
  }, [products, query])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" aria-hidden />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Zoek op naam, slug of categorie…"
          className="pl-9 bg-white border-[#E5E5E5]"
          aria-label="Zoek producten"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#E5E5E5] bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[#E5E5E5] bg-[#FAFAFA] text-xs font-medium uppercase tracking-wide text-[#666666]">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Categorie</th>
              <th className="px-4 py-3">Prijs/dag</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[#666666]">
                  Geen producten gevonden. Pas je zoekterm aan of voeg een product toe.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAFAFA]/80">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#111111]">{p.name}</div>
                    <div className="text-xs text-[#888888] font-mono">{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-[#333333]">{p.category.name}</td>
                  <td className="px-4 py-3 text-[#111111]">{formatPrice(p.pricePerDay)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.active
                          ? "inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                          : "inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                      }
                    >
                      {p.active ? "Actief" : "Verborgen"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/producten/${p.id}/bewerken`}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Bewerken
                        </Link>
                      </Button>
                      <DeleteProductButton productId={p.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[#888888]">
        {filtered.length} van {products.length} product{products.length === 1 ? "" : "en"}
        {query.trim() ? " (gefilterd)" : ""}
      </p>
    </div>
  )
}
