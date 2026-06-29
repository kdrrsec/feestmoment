import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { randomBytes } from "crypto"
import { authOptions } from "@/lib/auth"
import { putVercelBlobPublic } from "@/lib/vercel-blob-upload"

export const runtime = "nodejs"

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

function safeExt(mime: string): string {
  if (mime === "image/jpeg") return ".jpg"
  if (mime === "image/png") return ".png"
  if (mime === "image/webp") return ".webp"
  if (mime === "image/gif") return ".gif"
  return ".jpg"
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const form = await request.formData()
    const file = form.get("file")
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Geen bestand ontvangen" }, { status: 400 })
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Alleen JPEG, PNG, WebP of GIF zijn toegestaan" },
        { status: 400 }
      )
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Bestand is te groot (max. 5 MB)" }, { status: 400 })
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const baseName = `product-${Date.now()}-${randomBytes(4).toString("hex")}${safeExt(file.type)}`
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim()
    const isVercel = Boolean(process.env.VERCEL)

    if (blobToken) {
      const blob = await putVercelBlobPublic(baseName, bytes, file.type || "application/octet-stream", blobToken)
      return NextResponse.json({ url: blob.url })
    }

    if (isVercel) {
      return NextResponse.json(
        {
          error:
            "Upload op Vercel vereist Vercel Blob. Voeg BLOB_READ_WRITE_TOKEN toe in je Vercel-project (Storage → Blob).",
        },
        { status: 503 }
      )
    }

    const dir = path.join(process.cwd(), "public", "products")
    await mkdir(dir, { recursive: true })
    const localPath = path.join(dir, baseName)
    await writeFile(localPath, bytes)
    const url = `/products/${baseName}`
    return NextResponse.json({ url })
  } catch (e) {
    console.error("Upload image error:", e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload mislukt" },
      { status: 500 }
    )
  }
}
