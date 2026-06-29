"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { slugifyForUrl } from "@/lib/slugify"
import { parseImages } from "@/lib/utils"
import { ExternalLink, ArrowLeft } from "lucide-react"
import { DeleteProductButton } from "@/components/admin/delete-product-button"
import { ProductImageField } from "@/components/admin/product-image-field"

export type ProductEditorCategory = { id: string; name: string }

export type ProductEditorInitial = {
  id: string
  name: string
  slug: string
  description: string | null
  categoryId: string
  pricePerDay: number
  deposit: number
  stockQty: number
  images: string | string[]
  active: boolean
}

type ProductEditorProps = {
  categories: ProductEditorCategory[]
  product?: ProductEditorInitial
}

export function ProductEditor({ categories, product }: ProductEditorProps) {
  const isEdit = Boolean(product)
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [slugFollowsName, setSlugFollowsName] = useState(!isEdit)

  const [formData, setFormData] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    pricePerDay: product?.pricePerDay ?? 0,
    deposit: product?.deposit ?? 0,
    stockQty: product?.stockQty ?? 1,
    images: parseImages((product?.images as string | string[]) ?? "[]"),
    active: product?.active ?? true,
  })

  const applySlugFromName = () => {
    setFormData((prev) => ({ ...prev, slug: slugifyForUrl(prev.name) }))
    setSlugFollowsName(true)
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugFollowsName ? slugifyForUrl(name) : prev.slug,
    }))
  }

  const handleSlugChange = (slug: string) => {
    setSlugFollowsName(false)
    setFormData((prev) => ({ ...prev, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.categoryId) {
      toast({
        title: "Categorie verplicht",
        description: "Kies een categorie voor dit product.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products"
      const method = product ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: formData.images,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || "Opslaan mislukt")
      }

      const saved = await response.json()

      toast({
        title: "Opgeslagen",
        description: product ? "Product bijgewerkt." : "Product aangemaakt.",
      })

      if (!product && saved.id) {
        router.push(`/admin/producten/${saved.id}/bewerken`)
        router.refresh()
      } else {
        router.refresh()
      }
    } catch (err: unknown) {
      toast({
        title: "Fout",
        description: err instanceof Error ? err.message : "Er ging iets mis.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="sm" className="w-fit text-[#111111]" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar overzicht
          </Link>
        </Button>
        {isEdit && product && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/product/${formData.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Bekijk op de site
              </Link>
            </Button>
            <DeleteProductButton productId={product.id} redirectAfterDelete />
          </div>
        )}
      </div>

      <Card className="border-[#E5E5E5] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#111111]">{isEdit ? "Product bewerken" : "Nieuw product"}</CardTitle>
          <CardDescription className="text-[#666666]">
            Vul de gegevens in. De slug wordt voor nieuwe producten automatisch uit de naam gemaakt; je kunt die
            altijd zelf aanpassen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-sm text-destructive">
              Er zijn nog geen categorieën. Voer lokaal <code className="rounded bg-muted px-1">npm run db:seed</code>{" "}
              uit of voeg categorieën toe in de database.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4 lg:col-span-2">
                  <div>
                    <Label htmlFor="name">Naam *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                      className="mt-2"
                      placeholder="Bijv. Ballonnenboog roze & goud"
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-end justify-between gap-2">
                      <Label htmlFor="slug">Slug (URL) *</Label>
                      <Button type="button" variant="ghost" size="sm" className="h-auto py-0 text-xs" onClick={applySlugFromName}>
                        Slug uit naam vullen
                      </Button>
                    </div>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      required
                      className="mt-2 font-mono text-sm"
                      placeholder="ballonnenboog-roze-goud"
                    />
                    <p className="mt-1 text-xs text-[#666666]">Wordt gebruikt in de link: /product/jouw-slug</p>
                  </div>
                  <div>
                    <Label htmlFor="categoryId">Categorie *</Label>
                    <select
                      id="categoryId"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      required
                      className="mt-2 flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-[#111111] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">— Kies categorie —</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="description">Beschrijving</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={8}
                      className="mt-2 flex min-h-[160px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-[#111111]"
                      placeholder="Omschrijving voor op de productpagina…"
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] p-4">
                  <h3 className="text-sm font-semibold text-[#111111]">Prijzen &amp; voorraad</h3>
                  <div>
                    <Label htmlFor="pricePerDay">Prijs per dag (€) *</Label>
                    <Input
                      id="pricePerDay"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.pricePerDay}
                      onChange={(e) => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) || 0 })}
                      required
                      className="mt-2 bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deposit">Borg (€)</Label>
                    <Input
                      id="deposit"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.deposit}
                      onChange={(e) => setFormData({ ...formData, deposit: parseFloat(e.target.value) || 0 })}
                      className="mt-2 bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stockQty">Voorraad (intern) *</Label>
                    <Input
                      id="stockQty"
                      type="number"
                      min="0"
                      value={formData.stockQty}
                      onChange={(e) => setFormData({ ...formData, stockQty: parseInt(e.target.value, 10) || 0 })}
                      required
                      className="mt-2 bg-white"
                    />
                    <p className="mt-1 text-xs text-[#666666]">Op de site tonen we &ldquo;op aanvraag&rdquo;; dit veld is voor eigen administratie.</p>
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] p-4">
                  <h3 className="text-sm font-semibold text-[#111111]">Afbeeldingen</h3>
                  <ProductImageField
                    images={formData.images}
                    onChange={(urls) => setFormData({ ...formData, images: urls })}
                    disabled={loading}
                  />
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded border-input"
                    />
                    <Label htmlFor="active" className="font-normal">
                      Zichtbaar in assortiment
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-[#E5E5E5] pt-6">
                <Button type="submit" disabled={loading} className="min-w-[140px]">
                  {loading ? "Opslaan…" : "Opslaan"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin">Annuleren</Link>
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
