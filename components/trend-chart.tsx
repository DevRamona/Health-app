"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { HealthData } from "@/types/health"

interface TrendChartProps {
  data: HealthData[]
  dataKey: keyof HealthData
  secondaryKey?: keyof HealthData
  color?: string
  secondaryColor?: string
  title?: string
}

export function TrendChart({
  data,
  dataKey,
  secondaryKey,
  color = "#10b981",
  secondaryColor = "#f59e0b",
  title,
}: TrendChartProps) {
  // Filter and prepare data
  const chartData = data
    .filter((item) => item[dataKey] !== undefined || (secondaryKey && item[secondaryKey] !== undefined))
    .map((item, index) => {
      const date = new Date(item.date)
      return {
        index: index + 1,
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: date.toLocaleDateString(),
        [dataKey]: typeof item[dataKey] === "number" ? item[dataKey] : null,
        ...(secondaryKey && { [secondaryKey]: typeof item[secondaryKey] === "number" ? item[secondaryKey] : null }),
      }
    })
    .slice(-14) // Show last 14 data points

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p>No data available for this metric</p>
          <p className="text-sm">Start logging data to see trends</p>
        </div>
      </div>
    )
  }

  const formatLabel = (key: string) => {
    const labelMap: Record<string, string> = {
      sleepDuration: "Sleep (hours)",
      sleepQuality: "Sleep Quality",
      mood: "Mood Score",
      energy: "Energy Level",
      stress: "Stress Level",
      focus: "Focus Level",
      steps: "Daily Steps",
      weight: "Weight",
      heartRate: "Heart Rate",
      workoutDuration: "Workout (min)",
      workoutIntensity: "Intensity",
      waterIntake: "Water (oz)",
      screenTime: "Screen Time (hrs)",
    }
    return labelMap[key] || key
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              fontSize: "14px",
            }}
            labelFormatter={(label, payload) => {
              const item = payload?.[0]?.payload
              return item ? `${item.fullDate}` : label
            }}
            formatter={(value: any, name: string) => [
              typeof value === "number" ? value.toFixed(1) : value,
              formatLabel(name),
            ]}
          />
          {secondaryKey && <Legend />}
          <Line
            type="monotone"
            dataKey={dataKey as string}
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: "white" }}
            connectNulls={false}
            name={formatLabel(dataKey as string)}
          />
          {secondaryKey && (
            <Line
              type="monotone"
              dataKey={secondaryKey as string}
              stroke={secondaryColor}
              strokeWidth={3}
              dot={{ fill: secondaryColor, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: secondaryColor, strokeWidth: 2, fill: "white" }}
              connectNulls={false}
              name={formatLabel(secondaryKey as string)}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
