import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function calculateDays(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1 // Include both start and end date
}

// Parse images from JSON string (for SQLite compatibility)
/** Voor Next/Image: Vercel Blob-hostnames zijn per project uniek; zonder remotePatterns is unoptimized nodig. */
export function imageSrcNeedsUnoptimized(src: string): boolean {
  return /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(src)
}

export function parseImages(images: string | string[]): string[] {
  if (Array.isArray(images)) {
    return images
  }
  if (!images || images === '[]' || images === '{}') {
    return []
  }
  try {
    const parsed = JSON.parse(images)
    if (Array.isArray(parsed)) {
      return parsed.filter(img => img && typeof img === 'string' && img.length > 0)
    }
    return []
  } catch (e) {
    // If parsing fails, try to return as single string if it looks like a URL
    if (typeof images === 'string' && (images.startsWith('http') || images.startsWith('/'))) {
      return [images]
    }
    return []
  }
}
