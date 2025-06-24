"use client"

import { useState, useCallback } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { useStockSearch } from "@/hooks/use-stock-search"
import { SearchInput } from "@/components/search-input"
import { StockCard } from "@/components/stock-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"

export function SearchSection() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)

  const { data: searchResults, isLoading, error } = useStockSearch(debouncedQuery)

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">🔍 Search Stocks</h2>

      <SearchInput value={query} onChange={handleSearch} placeholder="Search by company name or ticker symbol..." />

      <div className="mt-6">
        {isLoading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <ErrorMessage message="Failed to search stocks. Please try again." onRetry={() => handleSearch(query)} />
        )}

        {searchResults && searchResults.length > 0 && (
          <div className="grid gap-4">
            {searchResults.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} showAddToWatchlist />
            ))}
          </div>
        )}

        {searchResults && searchResults.length === 0 && debouncedQuery && !isLoading && (
          <div className="text-center py-8 text-slate-500">No stocks found for "{debouncedQuery}"</div>
        )}
      </div>
    </div>
  )
}
