import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

/** Geen verouderde HTML-cache: wijzigingen uit het adminpanel moeten direct zichtbaar zijn. */
export const dynamic = "force-dynamic"
import Image from "next/image"
import { formatPrice, imageSrcNeedsUnoptimized, parseImages } from "@/lib/utils"
import { ProductDetailClient } from "@/components/product-detail-client"
import { Metadata } from "next"
import { absoluteUrl } from "@/lib/seo"

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, active: true },
      include: {
        category: true,
      },
    })

    return product
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug)
  
  if (!product) {
    return {}
  }

  const images = parseImages(product.images as string | string[])
  const ogImage = images[0]

  return {
    title: product.name,
    description:
      product.description ||
      `${product.name} huren voor uw evenement. Bekijk prijzen en beschikbaarheid bij Feestmoment Verhuur.`,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      type: "website",
      url: absoluteUrl(`/product/${product.slug}`),
      images: ogImage
        ? [
            {
              url: ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage),
            },
          ]
        : undefined,
    },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const images = parseImages(product.images as string | string[])
  const mainImageSrc =
    images[0] || "https://via.placeholder.com/800x800?text=Geen+afbeelding"

  return (
    <div className="container py-12 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={mainImageSrc}
              alt={product.name}
              fill
              unoptimized={imageSrcNeedsUnoptimized(mainImageSrc)}
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.slice(1, 5).map((image, idx) => (
                <div key={idx} className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={image}
                    alt={`${product.name} ${idx + 2}`}
                    fill
                    unoptimized={imageSrcNeedsUnoptimized(image)}
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-secondary mb-2">{product.category.name}</p>
          <h1 className="text-4xl font-serif font-bold mb-4">{product.name}</h1>
          
          <div className="mb-6">
            <div className="text-3xl font-semibold mb-2">
              {formatPrice(product.pricePerDay)} <span className="text-lg text-secondary">/dag</span>
            </div>
            {product.deposit > 0 && (
              <p className="text-sm text-secondary">
                Borg voor dit artikel: {formatPrice(product.deposit)}
              </p>
            )}
            <p className="text-xs text-secondary mt-2 max-w-xl leading-relaxed">
              De borg verschilt per product en ligt doorgaans tussen € 50 en € 200, afhankelijk van het artikel.
            </p>
          </div>

          {product.description && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Beschrijving</h2>
              <p className="text-secondary whitespace-pre-line">{product.description}</p>
            </div>
          )}

          <ProductDetailClient product={product} />
        </div>
      </div>
    </div>
  )
}
