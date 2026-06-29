"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

export function DeleteProductButton({
  productId,
  redirectAfterDelete,
}: {
  productId: string
  /** Na verwijderen naar /admin (bijv. op de bewerkpagina) */
  redirectAfterDelete?: boolean
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Weet u zeker dat u dit product wilt verwijderen?")) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Verwijderen mislukt")
      }

      toast({
        title: "Product verwijderd",
        description: "Het product is succesvol verwijderd.",
      })

      if (redirectAfterDelete) {
        router.push("/admin")
        router.refresh()
      } else {
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
