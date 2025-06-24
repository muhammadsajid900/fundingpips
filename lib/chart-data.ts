interface HistoricalDataPoint {
  date: string
  price: number
  volume?: number
}

export function generateHistoricalData(symbol: string, timeFrame: string, currentPrice: number): HistoricalDataPoint[] {
  const dataPoints = getDataPointsForTimeFrame(timeFrame)
  const data: HistoricalDataPoint[] = []

  // Generate realistic price movement
  let price = currentPrice
  const volatility = getVolatilityForSymbol(symbol)
  const trend = getTrendForSymbol(symbol)

  // Work backwards from current price
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = getDateForIndex(i, timeFrame)

    if (i === dataPoints - 1) {
      // Current price
      data.unshift({
        date: formatDateForTimeFrame(date, timeFrame),
        price: Math.round(price * 100) / 100,
        volume: Math.floor(Math.random() * 5000000) + 1000000,
      })
    } else {
      // Generate previous prices with realistic movement
      const randomChange = (Math.random() - 0.5) * volatility
      const trendInfluence = trend * 0.1
      const changePercent = (randomChange + trendInfluence) / 100

      price = price / (1 + changePercent)

      data.unshift({
        date: formatDateForTimeFrame(date, timeFrame),
        price: Math.round(price * 100) / 100,
        volume: Math.floor(Math.random() * 5000000) + 1000000,
      })
    }
  }

  return data
}

function getDataPointsForTimeFrame(timeFrame: string): number {
  switch (timeFrame) {
    case "1D":
      return 24 // Hourly data
    case "1W":
      return 7 // Daily data
    case "1M":
      return 30 // Daily data
    case "3M":
      return 90 // Daily data
    case "1Y":
      return 52 // Weekly data
    default:
      return 30
  }
}

function getDateForIndex(index: number, timeFrame: string): Date {
  const now = new Date()

  switch (timeFrame) {
    case "1D":
      return new Date(now.getTime() - (23 - index) * 60 * 60 * 1000)
    case "1W":
      return new Date(now.getTime() - (6 - index) * 24 * 60 * 60 * 1000)
    case "1M":
      return new Date(now.getTime() - (29 - index) * 24 * 60 * 60 * 1000)
    case "3M":
      return new Date(now.getTime() - (89 - index) * 24 * 60 * 60 * 1000)
    case "1Y":
      return new Date(now.getTime() - (51 - index) * 7 * 24 * 60 * 60 * 1000)
    default:
      return new Date(now.getTime() - (29 - index) * 24 * 60 * 60 * 1000)
  }
}

function formatDateForTimeFrame(date: Date, timeFrame: string): string {
  switch (timeFrame) {
    case "1D":
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    case "1W":
      return date.toLocaleDateString("en-US", {
        weekday: "short",
      })
    case "1M":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    case "3M":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    case "1Y":
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      })
    default:
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
  }
}

function getVolatilityForSymbol(symbol: string): number {
  // Different stocks have different volatilities
  const volatilities: Record<string, number> = {
    AAPL: 2.5,
    GOOGL: 3.0,
    MSFT: 2.2,
    AMZN: 3.5,
    TSLA: 6.0, // High volatility
    META: 4.0,
    NVDA: 5.0,
    NFLX: 4.5,
    AMD: 4.2,
    INTC: 2.8,
  }

  return volatilities[symbol] || 3.0
}

function getTrendForSymbol(symbol: string): number {
  // Simulate different trends (-1 to 1, where 1 is strong uptrend)
  const trends: Record<string, number> = {
    AAPL: 0.3,
    GOOGL: 0.2,
    MSFT: 0.4,
    AMZN: -0.1,
    TSLA: 0.1,
    META: 0.5,
    NVDA: 0.8, // Strong uptrend
    NFLX: -0.2,
    AMD: 0.3,
    INTC: -0.3,
  }

  return trends[symbol] || 0
}
