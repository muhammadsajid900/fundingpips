"use client"

import { useWatchlistStore } from "@/store/watchlist-store"
import { useStockPrices } from "@/hooks/use-stock-prices"
import { StockCard } from "@/components/stock-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"

export function WatchlistSection() {
  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlistStore()
  const { data: stockPrices, isLoading, error } = useStockPrices(watchlist)

  if (watchlist.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">⭐ Your Watchlist</h2>
        <div className="text-center py-12 text-slate-500">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-lg mb-2">Your watchlist is empty</p>
          <p className="text-sm">Search for stocks and add them to your watchlist</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">⭐ Your Watchlist ({watchlist.length})</h2>
        {watchlist.length > 0 && (
          <button onClick={clearWatchlist} className="text-sm text-slate-500 hover:text-red-600 transition-colors">
            Clear All
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {error && <ErrorMessage message="Failed to load watchlist prices" onRetry={() => window.location.reload()} />}

      {stockPrices && (
        <div className="space-y-4">
          {stockPrices.map((stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              showRemoveFromWatchlist
              onRemove={() => removeFromWatchlist(stock.symbol)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
