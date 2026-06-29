"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function DeleteReservationButton({
  reservationId,
  label = "Verwijderen",
}: {
  reservationId: string
  label?: string
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (
      !confirm(
        "Deze reservering verwijderen? De periode wordt weer vrijgegeven in de agenda (tenzij er nog een andere reservering is)."
      )
    ) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/reservations/${reservationId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("fail")
      toast({ title: "Reservering verwijderd", description: "De plek is weer vrij." })
      router.refresh()
    } catch {
      toast({
        title: "Fout",
        description: "Verwijderen is niet gelukt.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" className="text-red-700 border-red-200 hover:bg-red-50" onClick={handleDelete} disabled={loading}>
      <Trash2 className="h-4 w-4 mr-1" />
      {loading ? "…" : label}
    </Button>
  )
}
