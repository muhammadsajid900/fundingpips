import type { Stock } from "@/types/stock"

// Mock API key - in production, this would be in environment variables
const API_KEY = "demo"
const BASE_URL = "https://www.alphavantage.co/query"

// Cache for API responses to avoid hitting rate limits
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 60000 // 1 minute

function getCachedData(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

export async function searchStocks(query: string): Promise<Stock[]> {
  const cacheKey = `search:${query}`
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  try {
    // For demo purposes, we'll use mock data since Alpha Vantage has strict rate limits
    const mockResults = generateMockSearchResults(query)
    setCachedData(cacheKey, mockResults)
    return mockResults
  } catch (error) {
    console.error("Stock search failed:", error)
    throw new Error("Failed to search stocks")
  }
}

export async function getStockPrices(symbols: string[]): Promise<Stock[]> {
  const results: Stock[] = []

  for (const symbol of symbols) {
    const cacheKey = `price:${symbol}`
    let cached = getCachedData(cacheKey)

    if (!cached) {
      try {
        // For demo purposes, generate mock price data
        cached = generateMockPriceData(symbol)
        setCachedData(cacheKey, cached)
      } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error)
        // Continue with other symbols
        continue
      }
    }

    results.push(cached)
  }

  return results
}

// Mock data generators for demo purposes
function generateMockSearchResults(query: string): Stock[] {
  const mockStocks = [
    { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ" },
    { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ" },
    { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ" },
    { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ" },
    { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ" },
    { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ" },
    { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ" },
    { symbol: "NFLX", name: "Netflix Inc.", exchange: "NASDAQ" },
    { symbol: "AMD", name: "Advanced Micro Devices Inc.", exchange: "NASDAQ" },
    { symbol: "INTC", name: "Intel Corporation", exchange: "NASDAQ" },
  ]

  const filtered = mockStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase()),
  )

  return filtered.map((stock) => ({
    ...stock,
    ...generateMockPriceData(stock.symbol),
  }))
}

function generateMockPriceData(symbol: string): Stock {
  // Generate realistic mock data based on symbol
  const basePrice = getBasePriceForSymbol(symbol)
  const changePercent = (Math.random() - 0.5) * 10 // -5% to +5%
  const change = basePrice * (changePercent / 100)
  const price = basePrice + change

  return {
    symbol,
    name: getNameForSymbol(symbol),
    price: Math.round(price * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    exchange: "NASDAQ",
    marketCap: Math.floor(Math.random() * 2000000000000) + 100000000000, // 100B to 2T
    high52Week: Math.round(basePrice * 1.3 * 100) / 100,
    low52Week: Math.round(basePrice * 0.7 * 100) / 100,
  }
}

function getBasePriceForSymbol(symbol: string): number {
  const prices: Record<string, number> = {
    AAPL: 175,
    GOOGL: 140,
    MSFT: 380,
    AMZN: 145,
    TSLA: 240,
    META: 320,
    NVDA: 450,
    NFLX: 420,
    AMD: 140,
    INTC: 45,
  }
  return prices[symbol] || Math.floor(Math.random() * 200) + 50
}

function getNameForSymbol(symbol: string): string {
  const names: Record<string, string> = {
    AAPL: "Apple Inc.",
    GOOGL: "Alphabet Inc.",
    MSFT: "Microsoft Corporation",
    AMZN: "Amazon.com Inc.",
    TSLA: "Tesla Inc.",
    META: "Meta Platforms Inc.",
    NVDA: "NVIDIA Corporation",
    NFLX: "Netflix Inc.",
    AMD: "Advanced Micro Devices Inc.",
    INTC: "Intel Corporation",
  }
  return names[symbol] || `${symbol} Corporation`
}
