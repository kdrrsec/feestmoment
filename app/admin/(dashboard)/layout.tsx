import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, ShoppingBag, Calendar, Mail } from "lucide-react"
import { SignOutButton } from "@/components/admin/signout-button"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-[#E5E5E5] bg-white">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin" className="font-serif text-xl font-bold text-[#111111]">
            Admin Panel
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-[#111111] hover:bg-[#F8F8F8]">
                Naar website
              </Button>
            </Link>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside>
            <nav className="space-y-2">
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start text-[#111111] hover:bg-[#F8F8F8]">
                  <Package className="h-4 w-4 mr-2" />
                  Producten
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="ghost" className="w-full justify-start text-[#111111] hover:bg-[#F8F8F8]">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Bestellingen
                </Button>
              </Link>
              <Link href="/admin/calendar">
                <Button variant="ghost" className="w-full justify-start text-[#111111] hover:bg-[#F8F8F8]">
                  <Calendar className="h-4 w-4 mr-2" />
                  Kalender
                </Button>
              </Link>
              <Link href="/admin/leads">
                <Button variant="ghost" className="w-full justify-start text-[#111111] hover:bg-[#F8F8F8]">
                  <Mail className="h-4 w-4 mr-2" />
                  Leads
                </Button>
              </Link>
            </nav>
          </aside>

          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  )
}
