"use client"

import { useMemo } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { generateHistoricalData } from "@/lib/chart-data"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import type { Stock } from "@/types/stock"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface ComparisonChartProps {
  stock1: Stock
  stock2: Stock
  timeFrame: "1M" | "3M" | "6M" | "1Y"
}

export function ComparisonChart({ stock1, stock2, timeFrame }: ComparisonChartProps) {
  const chartData = useMemo(() => {
    const data1 = generateHistoricalData(stock1.symbol, timeFrame, stock1.price)
    const data2 = generateHistoricalData(stock2.symbol, timeFrame, stock2.price)

    // Normalize data to percentage change for fair comparison
    const normalizeData = (data: any[], symbol: string) => {
      const firstPrice = data[0].price
      return data.map((point) => ({
        ...point,
        normalizedReturn: ((point.price - firstPrice) / firstPrice) * 100,
      }))
    }

    const normalized1 = normalizeData(data1, stock1.symbol)
    const normalized2 = normalizeData(data2, stock2.symbol)

    return {
      labels: data1.map((point) => point.date),
      datasets: [
        {
          label: `${stock1.symbol} (${formatCurrency(stock1.price)})`,
          data: normalized1.map((point) => point.normalizedReturn),
          borderColor: "#3b82f6",
          backgroundColor: "#3b82f620",
          borderWidth: 3,
          fill: false,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#3b82f6",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 2,
        },
        {
          label: `${stock2.symbol} (${formatCurrency(stock2.price)})`,
          data: normalized2.map((point) => point.normalizedReturn),
          borderColor: "#10b981",
          backgroundColor: "#10b98120",
          borderWidth: 3,
          fill: false,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#10b981",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 2,
        },
      ],
    }
  }, [stock1, stock2, timeFrame])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context: any) => {
            return `Date: ${context[0].label}`
          },
          label: (context: any) => {
            const value = context.parsed.y
            return `${context.dataset.label}: ${formatPercentage(value)}`
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
          maxTicksLimit: 8,
        },
      },
      y: {
        display: true,
        position: "left" as const,
        grid: {
          color: "#f3f4f6",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
          callback: (value: any) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`,
        },
        title: {
          display: true,
          text: "Return (%)",
          color: "#6b7280",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="h-80">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="mt-4 text-center text-sm text-slate-600">
        Performance comparison showing percentage returns over {timeFrame.toLowerCase()}
      </div>
    </div>
  )
}
