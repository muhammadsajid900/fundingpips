"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Star, StarOff, TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StockChart } from "@/components/stock-chart"
import { StockComparison } from "@/components/stock-comparison"
import { useWatchlistStore } from "@/store/watchlist-store"
import { getStockPrices } from "@/lib/api"
import { formatCurrency, formatPercentage, formatCompactNumber } from "@/lib/utils"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import type { Stock } from "@/types/stock"

export default function StockDetailPage() {
  const params = useParams()
  const router = useRouter()
  const symbol = params.symbol as string

  const [stock, setStock] = useState<Stock | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore()
  const inWatchlist = stock ? isInWatchlist(stock.symbol) : false

  useEffect(() => {
    const loadStock = async () => {
      if (!symbol) return

      setIsLoading(true)
      setError(null)

      try {
        const stocks = await getStockPrices([symbol.toUpperCase()])
        if (stocks.length > 0) {
          setStock(stocks[0])
        } else {
          setError("Stock not found")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stock")
      } finally {
        setIsLoading(false)
      }
    }

    loadStock()
  }, [symbol])

  const handleWatchlistToggle = async () => {
    if (!stock) return

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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        </div>
      </main>
    )
  }

  if (error || !stock) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <ErrorMessage message={error || "Stock not found"} onRetry={() => window.location.reload()} />
          </div>
        </div>
      </main>
    )
  }

  const isPositive = stock.changePercent >= 0

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-slate-300" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {stock.symbol.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{stock.symbol}</h1>
                <p className="text-slate-600">{stock.name}</p>
              </div>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-4xl font-bold text-slate-900 mb-2">{formatCurrency(stock.price)}</div>
                  <div
                    className={`flex items-center gap-2 text-lg font-medium ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {formatCurrency(Math.abs(stock.change))} ({formatPercentage(Math.abs(stock.changePercent))})
                  </div>
                </div>

                <div className="hidden sm:block h-16 w-px bg-slate-200" />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-slate-600">Volume</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {stock.volume ? formatCompactNumber(stock.volume) : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Market Cap</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {stock.marketCap ? formatCompactNumber(stock.marketCap) : "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
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

                <Button
                  onClick={() => setShowCompareModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Compare
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-8">
          <StockChart stock={stock} />
        </div>

        {/* Key Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Key Statistics</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">52W High</div>
              <div className="text-lg font-semibold text-slate-900">
                {stock.high52Week ? formatCurrency(stock.high52Week) : "N/A"}
              </div>
            </div>

            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">52W Low</div>
              <div className="text-lg font-semibold text-slate-900">
                {stock.low52Week ? formatCurrency(stock.low52Week) : "N/A"}
              </div>
            </div>

            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">P/E Ratio</div>
              <div className="text-lg font-semibold text-slate-900">24.5</div>
            </div>

            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">Exchange</div>
              <div className="text-lg font-semibold text-slate-900">{stock.exchange || "NASDAQ"}</div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">About {stock.symbol}</h3>
          <p className="text-slate-600 leading-relaxed">
            {stock.name} is a publicly traded company listed on the {stock.exchange || "NASDAQ"} exchange. The company
            operates in the technology sector and has shown {isPositive ? "positive" : "negative"}
            performance with a current market capitalization of{" "}
            {stock.marketCap ? formatCompactNumber(stock.marketCap) : "N/A"}.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="secondary">Technology</Badge>
            <Badge variant="secondary">{stock.exchange || "NASDAQ"}</Badge>
            <Badge variant={isPositive ? "default" : "destructive"}>{isPositive ? "Gaining" : "Declining"}</Badge>
          </div>
        </div>
      </div>

      <StockComparison isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} initialStock={stock} />
    </main>
  )
}
