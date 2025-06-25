"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, TrendingUp, TrendingDown, SortAsc, SortDesc } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import { formatCurrency, formatPercentage, formatCompactNumber } from "@/lib/utils"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { Stock } from "@/types/stock"

interface StockListProps {
  stocks: Stock[]
  isLoading?: boolean
}

type SortField = "symbol" | "price" | "change" | "changePercent" | "volume" | "marketCap"
type SortDirection = "asc" | "desc"

export function StockList({ stocks, isLoading }: StockListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("symbol")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [filterType, setFilterType] = useState<"all" | "gainers" | "losers">("all")

  const debouncedQuery = useDebounce(searchQuery, 300)

  const filteredAndSortedStocks = useMemo(() => {
    let filtered = stocks

    // Apply search filter
    if (debouncedQuery) {
      filtered = filtered.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          stock.name?.toLowerCase().includes(debouncedQuery.toLowerCase()),
      )
    }

    // Apply type filter
    if (filterType === "gainers") {
      filtered = filtered.filter((stock) => stock.changePercent > 0)
    } else if (filterType === "losers") {
      filtered = filtered.filter((stock) => stock.changePercent < 0)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      // Handle string sorting
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      // Handle null/undefined values
      if (aValue == null) aValue = 0
      if (bValue == null) bValue = 0

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [stocks, debouncedQuery, sortField, sortDirection, filterType])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">All Stocks</h2>
            <p className="text-slate-600 text-sm mt-1">{filteredAndSortedStocks.length} stocks available</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filterType === "gainers" ? "default" : "outline"}
                onClick={() => setFilterType("gainers")}
                className={filterType === "gainers" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Gainers
              </Button>
              <Button
                size="sm"
                variant={filterType === "losers" ? "default" : "outline"}
                onClick={() => setFilterType("losers")}
                className={filterType === "losers" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                Losers
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-6">
                <button
                  onClick={() => handleSort("symbol")}
                  className="flex items-center gap-2 font-medium text-slate-700 hover:text-slate-900"
                >
                  Symbol
                  <SortIcon field="symbol" />
                </button>
              </th>
              <th className="text-left py-3 px-6 hidden sm:table-cell">
                <span className="font-medium text-slate-700">Name</span>
              </th>
              <th className="text-right py-3 px-6">
                <button
                  onClick={() => handleSort("price")}
                  className="flex items-center gap-2 font-medium text-slate-700 hover:text-slate-900 ml-auto"
                >
                  Price
                  <SortIcon field="price" />
                </button>
              </th>
              <th className="text-right py-3 px-6">
                <button
                  onClick={() => handleSort("changePercent")}
                  className="flex items-center gap-2 font-medium text-slate-700 hover:text-slate-900 ml-auto"
                >
                  Change
                  <SortIcon field="changePercent" />
                </button>
              </th>
              <th className="text-right py-3 px-6 hidden md:table-cell">
                <button
                  onClick={() => handleSort("volume")}
                  className="flex items-center gap-2 font-medium text-slate-700 hover:text-slate-900 ml-auto"
                >
                  Volume
                  <SortIcon field="volume" />
                </button>
              </th>
              <th className="text-right py-3 px-6 hidden lg:table-cell">
                <button
                  onClick={() => handleSort("marketCap")}
                  className="flex items-center gap-2 font-medium text-slate-700 hover:text-slate-900 ml-auto"
                >
                  Market Cap
                  <SortIcon field="marketCap" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAndSortedStocks.map((stock) => (
              <tr key={stock.symbol} className="hover:bg-slate-50 transition-colors cursor-pointer">
                <td className="py-4 px-6">
                  <Link href={`/stock/${stock.symbol}`} className="block">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {stock.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{stock.symbol}</div>
                        <div className="text-xs text-slate-500">{stock.exchange}</div>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="py-4 px-6 hidden sm:table-cell">
                  <Link href={`/stock/${stock.symbol}`} className="block">
                    <div className="text-slate-900 font-medium truncate max-w-xs">{stock.name}</div>
                  </Link>
                </td>
                <td className="py-4 px-6 text-right">
                  <Link href={`/stock/${stock.symbol}`} className="block">
                    <div className="font-semibold text-slate-900">{formatCurrency(stock.price)}</div>
                  </Link>
                </td>
                <td className="py-4 px-6 text-right">
                  <Link href={`/stock/${stock.symbol}`} className="block">
                    <div className="flex items-center justify-end gap-1">
                      <div
                        className={`flex items-center gap-1 text-sm font-medium ${
                          stock.changePercent >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stock.changePercent >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <div>
                          <div>{formatCurrency(Math.abs(stock.change))}</div>
                          <div className="text-xs">({formatPercentage(Math.abs(stock.changePercent))})</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="py-4 px-6 text-right hidden md:table-cell">
                  <Link href={`/stock/${stock.symbol}`} className="block">
                    <div className="text-slate-900 font-medium">
                      {stock.volume ? formatCompactNumber(stock.volume) : "N/A"}
                    </div>
                  </Link>
                </td>
                <td className="py-4 px-6 text-right hidden lg:table-cell">
                  <Link href={`/stock/${stock.symbol}`} className="block">
                    <div className="text-slate-900 font-medium">
                      {stock.marketCap ? formatCompactNumber(stock.marketCap) : "N/A"}
                    </div>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedStocks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg mb-2">No stocks found</div>
            <p className="text-slate-500 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
