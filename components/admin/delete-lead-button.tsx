"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function DeleteLeadButton({ leadId }: { leadId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Deze lead permanent verwijderen? Dit kan niet ongedaan worden gemaakt.")) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("fail")
      toast({ title: "Lead verwijderd" })
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
    <Button
      variant="outline"
      size="sm"
      className="text-red-700 border-red-200 hover:bg-red-50 shrink-0"
      onClick={handleDelete}
      disabled={loading}
      type="button"
    >
      <Trash2 className="h-4 w-4 mr-1" />
      {loading ? "…" : "Verwijderen"}
    </Button>
  )
}
