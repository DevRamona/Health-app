"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { HealthData } from "@/types/health"

interface TrendChartProps {
  data: HealthData[]
  dataKey: keyof HealthData
  secondaryKey?: keyof HealthData
  color?: string
  secondaryColor?: string
}

export function TrendChart({
  data,
  dataKey,
  secondaryKey,
  color = "#3b82f6",
  secondaryColor = "#8b5cf6",
}: TrendChartProps) {
  const chartData = data.map((item, index) => ({
    index,
    date: new Date(item.date).toLocaleDateString(),
    [dataKey]: item[dataKey],
    ...(secondaryKey && { [secondaryKey]: item[secondaryKey] }),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          stroke="#666"
          fontSize={12}
          tickFormatter={(value) => {
            const date = new Date(value)
            return `${date.getMonth() + 1}/${date.getDate()}`
          }}
        />
        <YAxis stroke="#666" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Line
          type="monotone"
          dataKey={dataKey as string}
          stroke={color}
          strokeWidth={3}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
        />
        {secondaryKey && (
          <Line
            type="monotone"
            dataKey={secondaryKey as string}
            stroke={secondaryColor}
            strokeWidth={3}
            dot={{ fill: secondaryColor, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: secondaryColor, strokeWidth: 2 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
