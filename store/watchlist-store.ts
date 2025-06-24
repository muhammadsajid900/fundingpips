import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WatchlistState {
  watchlist: string[]
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void
  clearWatchlist: () => void
  isInWatchlist: (symbol: string) => boolean
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],

      addToWatchlist: (symbol: string) => {
        const { watchlist } = get()
        if (!watchlist.includes(symbol)) {
          set({ watchlist: [...watchlist, symbol] })
        }
      },

      removeFromWatchlist: (symbol: string) => {
        const { watchlist } = get()
        set({ watchlist: watchlist.filter((s) => s !== symbol) })
      },

      clearWatchlist: () => {
        set({ watchlist: [] })
      },

      isInWatchlist: (symbol: string) => {
        const { watchlist } = get()
        return watchlist.includes(symbol)
      },
    }),
    {
      name: "watchlist-storage",
    },
  ),
)
