"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { HealthData } from "@/types/health"

interface CorrelationChartProps {
  data: HealthData[]
  xKey: keyof HealthData
  yKey: keyof HealthData
  xLabel: string
  yLabel: string
}

export function CorrelationChart({ data, xKey, yKey, xLabel, yLabel }: CorrelationChartProps) {
  const chartData = data
    .filter((item) => item[xKey] !== undefined && item[yKey] !== undefined)
    .map((item) => ({
      x: Number(item[xKey]),
      y: Number(item[yKey]),
      date: new Date(item.date).toLocaleDateString(),
    }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" dataKey="x" name={xLabel} stroke="#666" fontSize={12} />
        <YAxis type="number" dataKey="y" name={yLabel} stroke="#666" fontSize={12} />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          formatter={(value, name) => [value, name === "x" ? xLabel : yLabel]}
        />
        <Scatter dataKey="y" fill="#8b5cf6" fillOpacity={0.7} stroke="#7c3aed" strokeWidth={1} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
