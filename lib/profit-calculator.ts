import type { Stock } from "@/types/stock"

interface StockAnalysis {
  symbol: string
  shares: number
  investment: number
  projectedValue: number
  projectedProfit: number
  projectedReturn: number
}

interface ProfitAnalysis {
  stock1: StockAnalysis
  stock2: StockAnalysis
  winner: StockAnalysis & { symbol: string }
  profitDifference: number
  returnDifference: number
  riskAssessment: {
    level: "Low" | "Medium" | "High"
    volatility: number
  }
}

export function calculateProfitAnalysis(
  stock1: Stock,
  stock2: Stock,
  investmentAmount: number,
  timeFrame: "1M" | "3M" | "6M" | "1Y",
): ProfitAnalysis {
  // Calculate projected returns based on historical trends and market conditions
  const projectedReturn1 = calculateProjectedReturn(stock1, timeFrame)
  const projectedReturn2 = calculateProjectedReturn(stock2, timeFrame)

  // Calculate shares that can be bought
  const shares1 = Math.floor(investmentAmount / stock1.price)
  const shares2 = Math.floor(investmentAmount / stock2.price)

  // Calculate actual investment (accounting for fractional shares)
  const actualInvestment1 = shares1 * stock1.price
  const actualInvestment2 = shares2 * stock2.price

  // Calculate projected values
  const projectedPrice1 = stock1.price * (1 + projectedReturn1 / 100)
  const projectedPrice2 = stock2.price * (1 + projectedReturn2 / 100)

  const projectedValue1 = shares1 * projectedPrice1
  const projectedValue2 = shares2 * projectedPrice2

  // Calculate profits
  const projectedProfit1 = projectedValue1 - actualInvestment1
  const projectedProfit2 = projectedValue2 - actualInvestment2

  const stock1Analysis: StockAnalysis = {
    symbol: stock1.symbol,
    shares: shares1,
    investment: actualInvestment1,
    projectedValue: projectedValue1,
    projectedProfit: projectedProfit1,
    projectedReturn: projectedReturn1,
  }

  const stock2Analysis: StockAnalysis = {
    symbol: stock2.symbol,
    shares: shares2,
    investment: actualInvestment2,
    projectedValue: projectedValue2,
    projectedProfit: projectedProfit2,
    projectedReturn: projectedReturn2,
  }

  // Determine winner
  const winner = projectedProfit1 > projectedProfit2 ? stock1Analysis : stock2Analysis
  const profitDifference = Math.abs(projectedProfit1 - projectedProfit2)
  const returnDifference = Math.abs(projectedReturn1 - projectedReturn2)

  // Risk assessment
  const riskAssessment = calculateRiskAssessment(stock1, stock2)

  return {
    stock1: stock1Analysis,
    stock2: stock2Analysis,
    winner: { ...winner, symbol: winner.symbol },
    profitDifference,
    returnDifference,
    riskAssessment,
  }
}

function calculateProjectedReturn(stock: Stock, timeFrame: "1M" | "3M" | "6M" | "1Y"): number {
  // Base return calculation using current momentum and historical patterns
  const currentMomentum = stock.changePercent
  const volatility = getStockVolatility(stock.symbol)
  const marketTrend = getMarketTrend(stock.symbol)

  // Time frame multipliers
  const timeMultipliers = {
    "1M": 1,
    "3M": 2.8,
    "6M": 5.2,
    "1Y": 9.5,
  }

  const baseReturn = (currentMomentum * 0.3 + marketTrend * 0.7) * timeMultipliers[timeFrame]

  // Add some randomness for realistic projections
  const randomFactor = (Math.random() - 0.5) * volatility * 0.5

  return Math.round((baseReturn + randomFactor) * 100) / 100
}

function getStockVolatility(symbol: string): number {
  const volatilities: Record<string, number> = {
    AAPL: 25,
    GOOGL: 30,
    MSFT: 22,
    AMZN: 35,
    TSLA: 60,
    META: 40,
    NVDA: 50,
    NFLX: 45,
    AMD: 42,
    INTC: 28,
  }
  return volatilities[symbol] || 30
}

function getMarketTrend(symbol: string): number {
  // Simulated market trends for different stocks
  const trends: Record<string, number> = {
    AAPL: 8.5,
    GOOGL: 6.2,
    MSFT: 12.1,
    AMZN: -2.3,
    TSLA: 15.7,
    META: 18.9,
    NVDA: 25.4,
    NFLX: -5.1,
    AMD: 11.3,
    INTC: -8.2,
  }
  return trends[symbol] || 5.0
}

function calculateRiskAssessment(
  stock1: Stock,
  stock2: Stock,
): {
  level: "Low" | "Medium" | "High"
  volatility: number
} {
  const vol1 = getStockVolatility(stock1.symbol)
  const vol2 = getStockVolatility(stock2.symbol)
  const avgVolatility = (vol1 + vol2) / 2

  let level: "Low" | "Medium" | "High"
  if (avgVolatility < 25) {
    level = "Low"
  } else if (avgVolatility < 40) {
    level = "Medium"
  } else {
    level = "High"
  }

  return {
    level,
    volatility: Math.round(avgVolatility * 100) / 100,
  }
}
