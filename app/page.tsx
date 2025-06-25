"use client"

import { useState, useEffect } from "react"
import { StockList } from "@/components/stock-list"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { StockComparison } from "@/components/stock-comparison"
import { generateMockStockData } from "@/lib/mock-data"
import { formatCompactNumber } from "@/lib/utils"
import type { Stock } from "@/types/stock"

export default function DashboardPage() {
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [stocks, setStocks] = useState<Stock[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading popular stocks
    const loadStocks = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const mockStocks = generateMockStockData()
        setStocks(mockStocks)
      } finally {
        setIsLoading(false)
      }
    }

    loadStocks()
  }, [])

  // Calculate market stats
  const marketStats = {
    totalStocks: stocks.length,
    gainers: stocks.filter((s) => s.changePercent > 0).length,
    losers: stocks.filter((s) => s.changePercent < 0).length,
    totalVolume: stocks.reduce((sum, s) => sum + (s.volume || 0), 0),
    avgChange: stocks.length > 0 ? stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length : 0,
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
              <p className="text-slate-600">Track market performance and discover investment opportunities</p>
            </div>
            <Button onClick={() => setShowCompareModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Compare Stocks
            </Button>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{marketStats.totalStocks}</div>
                  <div className="text-sm text-slate-600">Total Stocks</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{marketStats.gainers}</div>
                  <div className="text-sm text-slate-600">Gainers</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{marketStats.losers}</div>
                  <div className="text-sm text-slate-600">Losers</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {formatCompactNumber(marketStats.totalVolume)}
                  </div>
                  <div className="text-sm text-slate-600">Total Volume</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stock List */}
        <div className="mb-8">
          <StockList stocks={stocks} isLoading={isLoading} />
        </div>
      </div>

      <StockComparison isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} />
    </main>
  )
}
