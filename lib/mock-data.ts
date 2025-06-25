import type { Stock } from "@/types/stock"

const popularStocks = [
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
  { symbol: "CRM", name: "Salesforce Inc.", exchange: "NYSE" },
  { symbol: "ORCL", name: "Oracle Corporation", exchange: "NYSE" },
  { symbol: "ADBE", name: "Adobe Inc.", exchange: "NASDAQ" },
  { symbol: "PYPL", name: "PayPal Holdings Inc.", exchange: "NASDAQ" },
  { symbol: "UBER", name: "Uber Technologies Inc.", exchange: "NYSE" },
  { symbol: "SPOT", name: "Spotify Technology S.A.", exchange: "NYSE" },
  { symbol: "ZOOM", name: "Zoom Video Communications Inc.", exchange: "NASDAQ" },
  { symbol: "SQ", name: "Block Inc.", exchange: "NYSE" },
  { symbol: "TWTR", name: "Twitter Inc.", exchange: "NYSE" },
  { symbol: "SNAP", name: "Snap Inc.", exchange: "NYSE" },
]

export function generateMockStockData(): Stock[] {
  return popularStocks.map((stock) => {
    const basePrice = getBasePriceForSymbol(stock.symbol)
    const changePercent = (Math.random() - 0.5) * 10 // -5% to +5%
    const change = basePrice * (changePercent / 100)
    const price = basePrice + change

    return {
      symbol: stock.symbol,
      name: stock.name,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: Math.floor(Math.random() * 50000000) + 1000000,
      exchange: stock.exchange,
      marketCap: Math.floor(Math.random() * 2000000000000) + 100000000000,
      high52Week: Math.round(basePrice * 1.4 * 100) / 100,
      low52Week: Math.round(basePrice * 0.6 * 100) / 100,
    }
  })
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
    CRM: 220,
    ORCL: 115,
    ADBE: 580,
    PYPL: 85,
    UBER: 55,
    SPOT: 180,
    ZOOM: 75,
    SQ: 95,
    TWTR: 45,
    SNAP: 12,
  }
  return prices[symbol] || Math.floor(Math.random() * 200) + 50
}
