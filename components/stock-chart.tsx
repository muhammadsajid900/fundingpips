"use client"

import { useState, useMemo } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { generateHistoricalData } from "@/lib/chart-data"
import { formatCurrency } from "@/lib/utils"
import type { Stock } from "@/types/stock"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface StockChartProps {
  stock: Stock
  className?: string
}

type TimeFrame = "1D" | "1W" | "1M" | "3M" | "1Y"

export function StockChart({ stock, className = "" }: StockChartProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1M")
  const [isLoading, setIsLoading] = useState(false)

  const historicalData = useMemo(() => {
    return generateHistoricalData(stock.symbol, timeFrame, stock.price)
  }, [stock.symbol, timeFrame, stock.price])

  const handleTimeFrameChange = async (newTimeFrame: TimeFrame) => {
    setIsLoading(true)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    setTimeFrame(newTimeFrame)
    setIsLoading(false)
  }

  const chartData = {
    labels: historicalData.map((point) => point.date),
    datasets: [
      {
        label: `${stock.symbol} Price`,
        data: historicalData.map((point) => point.price),
        borderColor: stock.changePercent >= 0 ? "#10b981" : "#ef4444",
        backgroundColor: stock.changePercent >= 0 ? "#10b98120" : "#ef444420",
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: stock.changePercent >= 0 ? "#10b981" : "#ef4444",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            return context[0].label
          },
          label: (context: any) => {
            return `Price: ${formatCurrency(context.parsed.y)}`
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
          maxTicksLimit: 6,
        },
      },
      y: {
        display: true,
        position: "right" as const,
        grid: {
          color: "#f3f4f6",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
          callback: (value: any) => formatCurrency(value),
        },
      },
    },
  }

  const timeFrames: TimeFrame[] = ["1D", "1W", "1M", "3M", "1Y"]

  const currentPrice = historicalData[historicalData.length - 1]?.price || stock.price
  const firstPrice = historicalData[0]?.price || stock.price
  const totalChange = currentPrice - firstPrice
  const totalChangePercent = (totalChange / firstPrice) * 100

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-slate-600" />
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{stock.symbol} Chart</h3>
              <p className="text-sm text-slate-600">{stock.name}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(currentPrice)}</div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                totalChange >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {formatCurrency(Math.abs(totalChange))} ({totalChangePercent >= 0 ? "+" : ""}
              {totalChangePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Time Frame Selector */}
        <div className="flex gap-2 mb-6">
          {timeFrames.map((tf) => (
            <Button
              key={tf}
              size="sm"
              variant={timeFrame === tf ? "default" : "outline"}
              onClick={() => handleTimeFrameChange(tf)}
              disabled={isLoading}
              className={`text-xs ${
                timeFrame === tf
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tf}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <div className="relative h-80">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50 rounded-lg">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>

        {/* Chart Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
          <div className="text-center">
            <div className="text-sm text-slate-600">High</div>
            <div className="font-semibold text-slate-900">
              {formatCurrency(Math.max(...historicalData.map((d) => d.price)))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-600">Low</div>
            <div className="font-semibold text-slate-900">
              {formatCurrency(Math.min(...historicalData.map((d) => d.price)))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-600">Volume</div>
            <div className="font-semibold text-slate-900">
              {stock.volume ? (stock.volume / 1000000).toFixed(1) + "M" : "N/A"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-600">Range</div>
            <div className="font-semibold text-slate-900">
              {formatCurrency(
                Math.max(...historicalData.map((d) => d.price)) - Math.min(...historicalData.map((d) => d.price)),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
