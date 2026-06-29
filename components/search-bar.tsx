"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  initialSearch?: string
  searchParams: { [key: string]: string | string[] | undefined }
}

export function SearchBar({ initialSearch, searchParams }: SearchBarProps) {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(initialSearch || "")
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setSearchValue(initialSearch || "")
  }, [initialSearch])

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [debounceTimer])

  const updateSearch = (value: string) => {
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Set new timer for debounced search
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      
      // Preserve existing params (except zoek)
      Object.entries(searchParams).forEach(([k, v]) => {
        if (k !== 'zoek' && v) {
          if (typeof v === 'string') {
            params.set(k, v)
          } else if (Array.isArray(v)) {
            v.forEach(val => {
              if (typeof val === 'string') {
                params.append(k, val)
              }
            })
          }
        }
      })
      
      // Add search term if not empty
      const trimmedValue = value.trim()
      if (trimmedValue) {
        params.set('zoek', trimmedValue)
      }
      
      const queryString = params.toString()
      router.push(`/assortiment${queryString ? `?${queryString}` : ''}`)
    }, 300) // 300ms debounce

    setDebounceTimer(timer)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    updateSearch(value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    updateSearch(searchValue)
  }

  return (
    <section className="bg-white border-b border-[#E5E5E5] sticky top-20 z-40">
      <div className="container py-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#666666]" />
            <Input
              type="text"
              placeholder="Zoek naar producten..."
              value={searchValue}
              onChange={handleChange}
              className="pl-12 pr-4 py-6 text-base border-[#E5E5E5] bg-white text-[#111111]"
            />
          </div>
        </form>
      </div>
    </section>
  )
}
