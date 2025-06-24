"use client"

import { useState, useEffect } from "react"
import { getStockPrices } from "@/lib/api"
import type { Stock } from "@/types/stock"

export function useStockPrices(symbols: string[]) {
  const [data, setData] = useState<Stock[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (symbols.length === 0) {
      setData([])
      setIsLoading(false)
      setError(null)
      return
    }

    const fetchPrices = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const prices = await getStockPrices(symbols)
        setData(prices)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch prices")
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrices()

    // Set up polling for real-time updates
    const interval = setInterval(fetchPrices, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [symbols])

  return { data, isLoading, error }
}
