"use client"

import { useState, useEffect } from "react"
import { searchStocks } from "@/lib/api"
import type { Stock } from "@/types/stock"

export function useStockSearch(query: string) {
  const [data, setData] = useState<Stock[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query || query.length < 2) {
      setData(null)
      setIsLoading(false)
      setError(null)
      return
    }

    const searchStocksAsync = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const results = await searchStocks(query)
        setData(results)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed")
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    searchStocksAsync()
  }, [query])

  return { data, isLoading, error }
}
