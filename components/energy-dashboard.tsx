"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Zap, Battery, TrendingUp, Clock } from "lucide-react"

interface EnergyDashboardProps {
  energyData?: {
    current: number
    average: number
    trend: "up" | "down" | "stable"
    timeOfDay: string
    factors: string[]
  }
}

export function EnergyDashboard({ energyData }: EnergyDashboardProps) {
  const defaultData = {
    current: 7,
    average: 6.5,
    trend: "up" as const,
    timeOfDay: "afternoon",
    factors: ["Good Sleep", "Exercise", "Healthy Meal"],
  }

  const data = energyData || defaultData

  const getEnergyColor = (level: number) => {
    if (level >= 8) return "text-green-600"
    if (level >= 6) return "text-amber-600"
    return "text-red-600"
  }

  const getEnergyBg = (level: number) => {
    if (level >= 8) return "from-green-500 to-emerald-500"
    if (level >= 6) return "from-amber-500 to-orange-500"
    return "from-red-500 to-rose-500"
  }

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-amber-50 to-orange-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src="/images/energy-boost.jpg" alt="Energy background" className="w-full h-full object-cover" />
      </div>

      <CardHeader className="relative z-10">
        <div className="mb-4">
          <img
            src="/images/mood-energy-tracking.jpg"
            alt="Energy tracking dashboard"
            className="w-full h-32 object-cover rounded-lg shadow-lg"
          />
        </div>

        <CardTitle className="flex items-center space-x-2 text-amber-700">
          <Zap className="h-5 w-5" />
          <span>Energy Dashboard</span>
        </CardTitle>
        <CardDescription>Monitor your energy patterns and optimization</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Energy */}
          <div className="p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-amber-200/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Battery className="h-4 w-4 text-amber-600" />
                <span className="font-semibold text-amber-700">Current Energy</span>
              </div>
              <span className={`text-2xl font-bold ${getEnergyColor(data.current)}`}>{data.current}/10</span>
            </div>

            <Progress value={data.current * 10} className="h-3 mb-2" />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>Optimal</span>
              <span>Peak</span>
            </div>
          </div>

          {/* Energy Trend */}
          <div className="p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-amber-200/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                <span className="font-semibold text-amber-700">7-Day Average</span>
              </div>
              <span className="text-2xl font-bold text-amber-600">{data.average}/10</span>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant={data.trend === "up" ? "default" : data.trend === "down" ? "destructive" : "secondary"}
                className="capitalize"
              >
                {data.trend === "up" ? "↗️" : data.trend === "down" ? "↘️" : "→"} {data.trend}
              </Badge>
              <span className="text-sm text-muted-foreground">vs last week</span>
            </div>
          </div>
        </div>

        {/* Time of Day Analysis */}
        <div className="p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-amber-200/50">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="font-semibold text-amber-700">Peak Energy Time</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {["morning", "afternoon", "evening", "night"].map((time) => (
              <div
                key={time}
                className={`p-2 rounded-lg text-center text-sm font-medium transition-all ${
                  time === data.timeOfDay
                    ? `bg-gradient-to-r ${getEnergyBg(data.current)} text-white shadow-md`
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {/* Energy Factors */}
        <div className="p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-amber-200/50">
          <h3 className="font-semibold text-amber-700 mb-3">Positive Energy Factors</h3>
          <div className="flex flex-wrap gap-2">
            {data.factors.map((factor, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700"
              >
                ✅ {factor}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
