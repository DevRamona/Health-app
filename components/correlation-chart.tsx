"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { HealthData } from "@/types/health"

interface CorrelationChartProps {
  data: HealthData[]
  xKey: keyof HealthData
  yKey: keyof HealthData
  xLabel: string
  yLabel: string
}

export function CorrelationChart({ data, xKey, yKey, xLabel, yLabel }: CorrelationChartProps) {
  // Filter and prepare data for correlation
  const chartData = data
    .filter((item) => {
      const xValue = item[xKey]
      const yValue = item[yKey]
      return typeof xValue === "number" && typeof yValue === "number" && !isNaN(xValue) && !isNaN(yValue)
    })
    .map((item) => {
      const date = new Date(item.date)
      return {
        x: Number(item[xKey]),
        y: Number(item[yKey]),
        date: date.toLocaleDateString(),
        fullDate: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      }
    })

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p>No correlation data available</p>
          <p className="text-sm">
            Need data for both {xLabel.toLowerCase()} and {yLabel.toLowerCase()}
          </p>
        </div>
      </div>
    )
  }

  // Calculate correlation coefficient
  const calculateCorrelation = () => {
    if (chartData.length < 2) return 0

    const n = chartData.length
    const sumX = chartData.reduce((sum, point) => sum + point.x, 0)
    const sumY = chartData.reduce((sum, point) => sum + point.y, 0)
    const sumXY = chartData.reduce((sum, point) => sum + point.x * point.y, 0)
    const sumX2 = chartData.reduce((sum, point) => sum + point.x * point.x, 0)
    const sumY2 = chartData.reduce((sum, point) => sum + point.y * point.y, 0)

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

    return denominator === 0 ? 0 : numerator / denominator
  }

  const correlation = calculateCorrelation()
  const correlationStrength =
    Math.abs(correlation) > 0.7
      ? "Strong"
      : Math.abs(correlation) > 0.4
        ? "Moderate"
        : Math.abs(correlation) > 0.2
          ? "Weak"
          : "None"

  return (
    <div className="h-64 w-full">
      <div className="mb-2 text-center">
        <span className="text-sm text-muted-foreground">
          Correlation: <span className="font-semibold">{correlation.toFixed(3)}</span> ({correlationStrength})
        </span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            type="number"
            dataKey="x"
            name={xLabel}
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yLabel}
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              fontSize: "14px",
            }}
            formatter={(value: any, name: string) => [
              typeof value === "number" ? value.toFixed(1) : value,
              name === "x" ? xLabel : yLabel,
            ]}
            labelFormatter={(label, payload) => {
              const item = payload?.[0]?.payload
              return item ? `Date: ${item.fullDate}` : ""
            }}
          />
          <Scatter dataKey="y" fill="#8b5cf6" fillOpacity={0.8}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#8b5cf6" />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
