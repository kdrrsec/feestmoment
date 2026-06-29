/**
 * Upload naar Vercel Blob via de officiële HTTP API, zonder @vercel/blob / undici.
 * Voorkomt Webpack-parsefouten op private fields in undici bij Next.js dev/build.
 *
 * @see https://vercel.com/docs/storage/vercel-blob
 */
const BLOB_API_BASE = "https://vercel.com/api/blob"

/** Moet gelijk blijven aan @vercel/blob BLOB_API_VERSION (nu 12). */
const BLOB_API_VERSION = "12"

export type VercelBlobPutResult = {
  url: string
  pathname?: string
}

export async function putVercelBlobPublic(
  pathname: string,
  body: Buffer,
  contentType: string,
  token: string
): Promise<VercelBlobPutResult> {
  const params = new URLSearchParams({ pathname })
  const res = await fetch(`${BLOB_API_BASE}/?${params.toString()}`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
      "x-api-version": process.env.VERCEL_BLOB_API_VERSION_OVERRIDE?.trim() || BLOB_API_VERSION,
      "x-content-length": String(body.length),
      "x-vercel-blob-access": "public",
      "x-content-type": contentType,
      "x-add-random-suffix": "0",
    },
    body: new Uint8Array(body),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg =
      typeof data?.error?.message === "string"
        ? data.error.message
        : typeof data?.message === "string"
          ? data.message
          : `Blob upload mislukt (${res.status})`
    throw new Error(msg)
  }

  if (typeof data?.url !== "string") {
    throw new Error("Onverwacht antwoord van Blob API")
  }

  return data as VercelBlobPutResult
}
