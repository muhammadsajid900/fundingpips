"use client"

import { useState } from "react"
import { X, TrendingUp, TrendingDown, Star, StarOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StockChart } from "@/components/stock-chart"
import { useWatchlistStore } from "@/store/watchlist-store"
import { formatCurrency, formatPercentage, formatCompactNumber } from "@/lib/utils"
import type { Stock } from "@/types/stock"

interface StockDetailModalProps {
  stock: Stock
  isOpen: boolean
  onClose: () => void
}

export function StockDetailModal({ stock, isOpen, onClose }: StockDetailModalProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore()
  const [isToggling, setIsToggling] = useState(false)

  const inWatchlist = isInWatchlist(stock.symbol)
  const isPositive = stock.changePercent >= 0

  const handleWatchlistToggle = async () => {
    setIsToggling(true)
    try {
      if (inWatchlist) {
        removeFromWatchlist(stock.symbol)
      } else {
        addToWatchlist(stock.symbol)
      }
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))
    } finally {
      setIsToggling(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900">{stock.symbol}</h2>
                <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  {stock.exchange || "NASDAQ"}
                </span>
              </div>
              {stock.name && <p className="text-slate-600">{stock.name}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant={inWatchlist ? "default" : "outline"}
              onClick={handleWatchlistToggle}
              disabled={isToggling}
              className={
                inWatchlist
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "border-yellow-300 text-yellow-600 hover:bg-yellow-50"
              }
            >
              {isToggling ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : inWatchlist ? (
                <Star className="w-4 h-4 fill-current" />
              ) : (
                <StarOff className="w-4 h-4" />
              )}
              {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
            </Button>

            <Button size="sm" variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Price Info */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{formatCurrency(stock.price)}</div>
                <div
                  className={`flex items-center gap-2 text-lg font-medium ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  {formatCurrency(Math.abs(stock.change))} ({formatPercentage(Math.abs(stock.changePercent))})
                </div>
              </div>

              {stock.volume && (
                <div className="text-right">
                  <div className="text-sm text-slate-600">Volume</div>
                  <div className="text-lg font-semibold text-slate-900">{formatCompactNumber(stock.volume)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="p-6">
            <StockChart stock={stock} />
          </div>

          {/* Additional Stats */}
          <div className="p-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-slate-600">Market Cap</div>
                <div className="font-semibold text-slate-900">
                  {stock.marketCap ? formatCompactNumber(stock.marketCap) : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-600">52W High</div>
                <div className="font-semibold text-slate-900">
                  {stock.high52Week ? formatCurrency(stock.high52Week) : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-600">52W Low</div>
                <div className="font-semibold text-slate-900">
                  {stock.low52Week ? formatCurrency(stock.low52Week) : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-600">P/E Ratio</div>
                <div className="font-semibold text-slate-900">24.5</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
