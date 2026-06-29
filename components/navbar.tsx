"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-white backdrop-blur-md">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center -ml-4 md:-ml-8 focus:outline-none focus-visible:outline-none">
          <Image
            src="/logo.png"
            alt="Feestmoment Verhuur"
            width={180}
            height={180}
            className="h-[180px] w-auto object-contain"
            priority
            sizes="180px"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/assortiment" 
            className="text-sm font-medium text-[#111111] hover:text-[#C6A76B] transition-colors focus:outline-none focus-visible:outline-none"
          >
            Assortiment
          </Link>
          <Link 
            href="/offerte" 
            className="text-sm font-medium text-[#111111] hover:text-[#C6A76B] transition-colors focus:outline-none focus-visible:outline-none"
          >
            Offerte aanvragen
          </Link>
          <Link 
            href="/over-ons" 
            className="text-sm font-medium text-[#111111] hover:text-[#C6A76B] transition-colors focus:outline-none focus-visible:outline-none"
          >
            Over ons
          </Link>
          <Link 
            href="/contact" 
            className="text-sm font-medium text-[#111111] hover:text-[#C6A76B] transition-colors focus:outline-none focus-visible:outline-none"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
              <SheetHeader>
                <SheetTitle className="text-[#111111]">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/assortiment"
                  className="text-base font-medium text-[#111111] hover:text-[#C6A76B] transition-colors py-2 focus:outline-none focus-visible:outline-none"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Assortiment
                </Link>
                <Link
                  href="/offerte"
                  className="text-base font-medium text-[#111111] hover:text-[#C6A76B] transition-colors py-2 focus:outline-none focus-visible:outline-none"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Offerte aanvragen
                </Link>
                <Link
                  href="/over-ons"
                  className="text-base font-medium text-[#111111] hover:text-[#C6A76B] transition-colors py-2 focus:outline-none focus-visible:outline-none"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Over ons
                </Link>
                <Link
                  href="/contact"
                  className="text-base font-medium text-[#111111] hover:text-[#C6A76B] transition-colors py-2 focus:outline-none focus-visible:outline-none"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
