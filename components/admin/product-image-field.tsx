"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

type ProductImageFieldProps = {
  images: string[]
  onChange: (urls: string[]) => void
  disabled?: boolean
}

export function ProductImageField({ images, onChange, disabled }: ProductImageFieldProps) {
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"))
    if (list.length === 0) {
      toast({ title: "Geen afbeeldingen", description: "Kies JPEG, PNG, WebP of GIF.", variant: "destructive" })
      return
    }

    setUploading(true)
    try {
      const next = [...images]
      for (const file of list) {
        const fd = new FormData()
        fd.append("file", file)
        const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(typeof data.error === "string" ? data.error : "Upload mislukt")
        }
        if (typeof data.url === "string") {
          next.push(data.url)
        }
      }
      onChange(next)
    } catch (e) {
      toast({
        title: "Upload mislukt",
        description: e instanceof Error ? e.message : "Probeer het opnieuw.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const onDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (disabled || uploading) return
    const files = e.dataTransfer.files
    if (files?.length) void uploadFiles(files)
  }

  const removeAt = (i: number) => {
    onChange(images.filter((_, j) => j !== i))
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    const copy = [...images]
    const [item] = copy.splice(from, 1)
    copy.splice(to, 0, item)
    onChange(copy)
  }

  const onReorderDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files?.length) {
      if (disabled || uploading) return
      void uploadFiles(e.dataTransfer.files)
      return
    }
    if (dragIndex === null) return
    move(dragIndex, targetIndex)
    setDragIndex(null)
  }

  return (
    <div className="space-y-3">
      <Label>Afbeeldingen</Label>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          if (!disabled && !uploading) setDragActive(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled && !uploading) setDragActive(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragActive(false)
        }}
        onDrop={onDropZoneDrop}
        className={cn(
          "relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-8 text-center transition-colors",
          dragActive ? "border-[#111111] bg-[#F0F0F0]" : "border-[#CCCCCC] bg-white",
          (disabled || uploading) && "pointer-events-none opacity-60"
        )}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          disabled={disabled || uploading}
          onChange={(e) => {
            const f = e.target.files
            if (f?.length) void uploadFiles(f)
            e.target.value = ""
          }}
        />
        <Upload className="mb-2 h-8 w-8 text-[#666666]" aria-hidden />
        <p className="text-sm font-medium text-[#111111]">
          {uploading ? "Uploaden…" : "Sleep afbeeldingen hierheen of klik om te kiezen"}
        </p>
        <p className="mt-1 text-xs text-[#666666]">JPEG, PNG, WebP of GIF · max. 5 MB per bestand</p>
      </div>

      {images.length > 0 && (
        <ul className="space-y-2">
          {images.map((url, i) => (
            <li
              key={`${url}-${i}`}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragEnd={() => setDragIndex(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onReorderDrop(e, i)}
              className="flex items-center gap-3 rounded-md border border-[#E5E5E5] bg-white p-2"
            >
              <span className="cursor-grab text-[#999999]" title="Sleep om volgorde te wijzigen">
                <GripVertical className="h-5 w-5" />
              </span>
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-[#E5E5E5] bg-[#FAFAFA]">
                <img src={url} alt="" className="h-full w-full object-cover" />
              </div>
              <p className="min-w-0 flex-1 truncate font-mono text-xs text-[#666666]" title={url}>
                {url}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => removeAt(i)}
                disabled={disabled || uploading}
                aria-label="Verwijder afbeelding"
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-[#666666]">
        Lokaal worden bestanden opgeslagen in <code className="rounded bg-muted px-1">/public/products</code>. Op Vercel
        heb je{" "}
        <a
          href="https://vercel.com/docs/storage/vercel-blob"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          onClick={(e) => e.stopPropagation()}
        >
          Vercel Blob
        </a>{" "}
        nodig (omgevingsvariabele <code className="rounded bg-muted px-1">BLOB_READ_WRITE_TOKEN</code>).
      </p>
    </div>
  )
}
