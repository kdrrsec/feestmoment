import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice, imageSrcNeedsUnoptimized, parseImages } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    description: string | null
    pricePerDay: number
    images: string | string[]
    category: {
      name: string
    }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const images = parseImages(product.images)
  const imageUrl = images[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&auto=format&fit=crop'

  return (
    <Card className="group cursor-pointer h-full flex flex-col overflow-hidden border-[#E5E5E5]">
      <Link href={`/product/${product.slug}`} className="flex flex-col h-full focus:outline-none focus-visible:outline-none active:bg-transparent visited:bg-transparent active:bg-transparent">
        <div className="relative aspect-video w-full overflow-hidden bg-[#F8F8F8]">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            unoptimized={imageSrcNeedsUnoptimized(imageUrl)}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary">
              Op aanvraag
            </Badge>
          </div>
        </div>
        <CardContent className="pt-6 flex-grow">
          <p className="text-sm text-[#666666] mb-2 uppercase tracking-wide">
            {product.category.name}
          </p>
          <h3 className="font-serif text-xl font-semibold mb-2 text-[#111111] group-hover:text-accent-gold transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-[#666666] line-clamp-2 mb-4">
              {product.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="pt-0 pb-6 flex justify-between items-center">
          <div>
            <span className="text-2xl font-serif font-bold text-[#111111]">
              {formatPrice(product.pricePerDay)}
            </span>
            <span className="text-sm text-[#666666] ml-1">/dag</span>
          </div>
          <Button variant="ghost" size="icon" className="group-hover:bg-[#F8F8F8]">
            <ArrowRight className="h-4 w-4 text-[#111111]" />
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}
