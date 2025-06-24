"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Plus, X, BarChart3, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWatchlistStore } from "@/store/watchlist-store"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import type { Stock } from "@/types/stock"
import { StockDetailModal } from "@/components/stock-detail-modal"
import { StockComparison } from "@/components/stock-comparison"

interface StockCardProps {
  stock: Stock
  showAddToWatchlist?: boolean
  showRemoveFromWatchlist?: boolean
  onRemove?: () => void
}

export function StockCard({ stock, showAddToWatchlist, showRemoveFromWatchlist, onRemove }: StockCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCompareModal, setShowCompareModal] = useState(false)
  const { addToWatchlist, isInWatchlist } = useWatchlistStore()

  const isPositive = stock.changePercent >= 0
  const inWatchlist = isInWatchlist(stock.symbol)

  const handleAddToWatchlist = async () => {
    if (inWatchlist) return

    setIsAdding(true)
    try {
      addToWatchlist(stock.symbol)
      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300))
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-slate-900 text-lg">{stock.symbol}</h3>
            <span className="text-sm text-slate-600 bg-slate-200 px-2 py-1 rounded">{stock.exchange || "NASDAQ"}</span>
          </div>

          {stock.name && <p className="text-slate-600 text-sm mb-3 line-clamp-1">{stock.name}</p>}

          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(stock.price)}</div>

            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {formatCurrency(Math.abs(stock.change))} ({formatPercentage(Math.abs(stock.changePercent))})
            </div>
          </div>

          {stock.volume && <div className="mt-2 text-xs text-slate-500">Volume: {stock.volume.toLocaleString()}</div>}
        </div>

        <div className="flex flex-col gap-2 ml-4">
          {showAddToWatchlist && !inWatchlist && (
            <Button
              size="sm"
              onClick={handleAddToWatchlist}
              disabled={isAdding}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          )}

          {showAddToWatchlist && inWatchlist && (
            <Button size="sm" variant="outline" disabled className="bg-green-50 border-green-200 text-green-700">
              ✓ Added
            </Button>
          )}

          {showRemoveFromWatchlist && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRemove}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowDetailModal(true)}
            className="bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
          >
            <BarChart3 className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCompareModal(true)}
            className="bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <StockDetailModal stock={stock} isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} />
      <StockComparison isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} initialStock={stock} />
    </div>
  )
}
