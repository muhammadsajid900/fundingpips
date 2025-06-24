"use client"

import { useState, useMemo } from "react"
import { X, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ComparisonChart } from "@/components/comparison-chart"
import { useStockSearch } from "@/hooks/use-stock-search"
import { useDebounce } from "@/hooks/use-debounce"
import { formatCurrency, formatPercentage, formatCompactNumber } from "@/lib/utils"
import { calculateProfitAnalysis } from "@/lib/profit-calculator"
import type { Stock } from "@/types/stock"

interface StockComparisonProps {
  isOpen: boolean
  onClose: () => void
  initialStock?: Stock
}

export function StockComparison({ isOpen, onClose, initialStock }: StockComparisonProps) {
  const [stock1, setStock1] = useState<Stock | null>(initialStock || null)
  const [stock2, setStock2] = useState<Stock | null>(null)
  const [searchQuery1, setSearchQuery1] = useState("")
  const [searchQuery2, setSearchQuery2] = useState("")
  const [investmentAmount, setInvestmentAmount] = useState(10000)
  const [timeFrame, setTimeFrame] = useState<"1M" | "3M" | "6M" | "1Y">("3M")

  const debouncedQuery1 = useDebounce(searchQuery1, 300)
  const debouncedQuery2 = useDebounce(searchQuery2, 300)

  const { data: searchResults1 } = useStockSearch(debouncedQuery1)
  const { data: searchResults2 } = useStockSearch(debouncedQuery2)

  const profitAnalysis = useMemo(() => {
    if (!stock1 || !stock2) return null
    return calculateProfitAnalysis(stock1, stock2, investmentAmount, timeFrame)
  }, [stock1, stock2, investmentAmount, timeFrame])

  const handleStockSelect = (stock: Stock, position: 1 | 2) => {
    if (position === 1) {
      setStock1(stock)
      setSearchQuery1("")
    } else {
      setStock2(stock)
      setSearchQuery2("")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Stock Comparison & Profit Analysis</h2>
          </div>
          <Button size="sm" variant="outline" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          {/* Stock Selection */}
          <div className="p-6 border-b border-slate-200">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Stock 1 Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Stock 1</label>
                {stock1 ? (
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900">{stock1.symbol}</div>
                      <div className="text-sm text-slate-600">{stock1.name}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setStock1(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      placeholder="Search for first stock..."
                      value={searchQuery1}
                      onChange={(e) => setSearchQuery1(e.target.value)}
                      className="mb-2"
                    />
                    {searchResults1 && searchResults1.length > 0 && searchQuery1 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {searchResults1.slice(0, 5).map((stock) => (
                          <button
                            key={stock.symbol}
                            onClick={() => handleStockSelect(stock, 1)}
                            className="w-full p-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                          >
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-sm text-slate-600">{stock.name}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Stock 2 Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Stock 2</label>
                {stock2 ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900">{stock2.symbol}</div>
                      <div className="text-sm text-slate-600">{stock2.name}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setStock2(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      placeholder="Search for second stock..."
                      value={searchQuery2}
                      onChange={(e) => setSearchQuery2(e.target.value)}
                      className="mb-2"
                    />
                    {searchResults2 && searchResults2.length > 0 && searchQuery2 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {searchResults2.slice(0, 5).map((stock) => (
                          <button
                            key={stock.symbol}
                            onClick={() => handleStockSelect(stock, 2)}
                            className="w-full p-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                          >
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-sm text-slate-600">{stock.name}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Investment Settings */}
            {stock1 && stock2 && (
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Investment Amount</label>
                  <Input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="w-32"
                    min="100"
                    step="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time Frame</label>
                  <select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value as "1M" | "3M" | "6M" | "1Y")}
                    className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1M">1 Month</option>
                    <option value="3M">3 Months</option>
                    <option value="6M">6 Months</option>
                    <option value="1Y">1 Year</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Comparison Content */}
          {stock1 && stock2 && profitAnalysis && (
            <>
              {/* Profit Analysis Summary */}
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Profit Analysis Summary</h3>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Winner Card */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-sm text-green-700 font-medium mb-1">Better Investment</div>
                      <div className="text-2xl font-bold text-green-800 mb-2">{profitAnalysis.winner.symbol}</div>
                      <div className="text-lg font-semibold text-green-700">
                        +{formatCurrency(profitAnalysis.winner.projectedProfit)}
                      </div>
                      <div className="text-sm text-green-600">
                        ({formatPercentage(profitAnalysis.winner.projectedReturn)})
                      </div>
                    </div>
                  </div>

                  {/* Profit Difference */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-sm text-slate-600 font-medium mb-1">Profit Difference</div>
                      <div className="text-2xl font-bold text-slate-900 mb-2">
                        {formatCurrency(profitAnalysis.profitDifference)}
                      </div>
                      <div className="text-sm text-slate-600">{profitAnalysis.winner.symbol} outperforms by</div>
                      <div className="text-lg font-semibold text-slate-700">
                        {formatPercentage(profitAnalysis.returnDifference)}
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-sm text-orange-700 font-medium mb-1">Risk Level</div>
                      <div className="text-2xl font-bold text-orange-800 mb-2">
                        {profitAnalysis.riskAssessment.level}
                      </div>
                      <div className="text-sm text-orange-600">
                        Volatility: {profitAnalysis.riskAssessment.volatility}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Detailed Comparison</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Stock 1 Details */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">{stock1.symbol}</h4>
                        <p className="text-sm text-slate-600">{stock1.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-slate-900">{formatCurrency(stock1.price)}</div>
                        <div
                          className={`text-sm font-medium ${stock1.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {stock1.changePercent >= 0 ? "+" : ""}
                          {formatPercentage(stock1.changePercent)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Shares to Buy:</span>
                        <span className="font-medium">{profitAnalysis.stock1.shares}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Investment:</span>
                        <span className="font-medium">{formatCurrency(profitAnalysis.stock1.investment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Projected Value:</span>
                        <span className="font-medium">{formatCurrency(profitAnalysis.stock1.projectedValue)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm text-slate-600">Projected Profit:</span>
                        <span
                          className={`font-semibold ${profitAnalysis.stock1.projectedProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {profitAnalysis.stock1.projectedProfit >= 0 ? "+" : ""}
                          {formatCurrency(profitAnalysis.stock1.projectedProfit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Return:</span>
                        <span
                          className={`font-semibold ${profitAnalysis.stock1.projectedReturn >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatPercentage(profitAnalysis.stock1.projectedReturn)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock 2 Details */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">{stock2.symbol}</h4>
                        <p className="text-sm text-slate-600">{stock2.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-slate-900">{formatCurrency(stock2.price)}</div>
                        <div
                          className={`text-sm font-medium ${stock2.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {stock2.changePercent >= 0 ? "+" : ""}
                          {formatPercentage(stock2.changePercent)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Shares to Buy:</span>
                        <span className="font-medium">{profitAnalysis.stock2.shares}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Investment:</span>
                        <span className="font-medium">{formatCurrency(profitAnalysis.stock2.investment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Projected Value:</span>
                        <span className="font-medium">{formatCurrency(profitAnalysis.stock2.projectedValue)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm text-slate-600">Projected Profit:</span>
                        <span
                          className={`font-semibold ${profitAnalysis.stock2.projectedProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {profitAnalysis.stock2.projectedProfit >= 0 ? "+" : ""}
                          {formatCurrency(profitAnalysis.stock2.projectedProfit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Return:</span>
                        <span
                          className={`font-semibold ${profitAnalysis.stock2.projectedReturn >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatPercentage(profitAnalysis.stock2.projectedReturn)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Performance Metrics</h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 px-4 font-medium text-slate-700">Metric</th>
                        <th className="text-center py-2 px-4 font-medium text-blue-700">{stock1.symbol}</th>
                        <th className="text-center py-2 px-4 font-medium text-green-700">{stock2.symbol}</th>
                        <th className="text-center py-2 px-4 font-medium text-slate-700">Winner</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 px-4 text-slate-600">Current Price</td>
                        <td className="py-3 px-4 text-center font-medium">{formatCurrency(stock1.price)}</td>
                        <td className="py-3 px-4 text-center font-medium">{formatCurrency(stock2.price)}</td>
                        <td className="py-3 px-4 text-center">-</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-600">Market Cap</td>
                        <td className="py-3 px-4 text-center font-medium">
                          {formatCompactNumber(stock1.marketCap || 0)}
                        </td>
                        <td className="py-3 px-4 text-center font-medium">
                          {formatCompactNumber(stock2.marketCap || 0)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {(stock1.marketCap || 0) > (stock2.marketCap || 0) ? stock1.symbol : stock2.symbol}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-600">Volume</td>
                        <td className="py-3 px-4 text-center font-medium">{formatCompactNumber(stock1.volume || 0)}</td>
                        <td className="py-3 px-4 text-center font-medium">{formatCompactNumber(stock2.volume || 0)}</td>
                        <td className="py-3 px-4 text-center">
                          {(stock1.volume || 0) > (stock2.volume || 0) ? stock1.symbol : stock2.symbol}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-600">Projected Return</td>
                        <td className="py-3 px-4 text-center font-medium">
                          {formatPercentage(profitAnalysis.stock1.projectedReturn)}
                        </td>
                        <td className="py-3 px-4 text-center font-medium">
                          {formatPercentage(profitAnalysis.stock2.projectedReturn)}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-green-600">
                          {profitAnalysis.winner.symbol}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Comparison Chart */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Price Comparison Chart</h3>
                <ComparisonChart stock1={stock1} stock2={stock2} timeFrame={timeFrame} />
              </div>
            </>
          )}

          {/* Empty State */}
          {(!stock1 || !stock2) && (
            <div className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Select Two Stocks to Compare</h3>
              <p className="text-slate-600">
                Choose two stocks to analyze their performance, compare potential profits, and make informed investment
                decisions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
