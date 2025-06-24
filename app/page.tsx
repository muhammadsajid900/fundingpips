"use client"
import { useState, Suspense } from "react"
import { SearchSection } from "@/components/search-section"
import { WatchlistSection } from "@/components/watchlist-section"
import { StockSearchSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import { StockComparison } from "@/components/stock-comparison"

export default function HomePage() {
  const [showCompareModal, setShowCompareModal] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">📈 FundingPips Stock Tracker</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-6">
            Track real-time stock prices, analyze trends, and manage your personal watchlist
          </p>
          <Button onClick={() => setShowCompareModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Compare Stocks
          </Button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Suspense fallback={<StockSearchSkeleton />}>
              <SearchSection />
            </Suspense>
          </div>

          <div className="lg:col-span-1">
            <Suspense fallback={<div className="animate-pulse bg-white rounded-lg h-96" />}>
              <WatchlistSection />
            </Suspense>
          </div>
        </div>
      </div>
      <StockComparison isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} />
    </main>
  )
}
