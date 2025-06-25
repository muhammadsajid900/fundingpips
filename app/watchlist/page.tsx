"use client"

import { WatchlistSection } from "@/components/watchlist-section"

export default function WatchlistPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Watchlist</h1>
          <p className="text-slate-600">Keep track of your favorite stocks and monitor their performance</p>
        </div>

        <WatchlistSection />
      </div>
    </main>
  )
}
