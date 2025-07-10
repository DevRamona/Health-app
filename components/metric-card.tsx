"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
  title: string
  value: number
  unit: string
  target: number
  icon: LucideIcon
  color: "blue" | "green" | "yellow" | "purple" | "red" | "cyan"
  trend: number // percentage change
}

export function MetricCard({ title, value, unit, target, icon: Icon, color, trend }: MetricCardProps) {
  const percentage = Math.min((value / target) * 100, 100)
  const isPositiveTrend = trend > 0

  const colorClasses = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      text: "text-blue-600",
      progress: "bg-blue-500",
      badge: "bg-blue-100 text-blue-800",
    },
    green: {
      bg: "from-emerald-500 to-green-600",
      text: "text-emerald-600",
      progress: "bg-emerald-500",
      badge: "bg-emerald-100 text-emerald-800",
    },
    yellow: {
      bg: "from-amber-500 to-yellow-600",
      text: "text-amber-600",
      progress: "bg-amber-500",
      badge: "bg-amber-100 text-amber-800",
    },
    purple: {
      bg: "from-violet-500 to-purple-600",
      text: "text-violet-600",
      progress: "bg-violet-500",
      badge: "bg-violet-100 text-violet-800",
    },
    red: {
      bg: "from-rose-500 to-red-600",
      text: "text-rose-600",
      progress: "bg-rose-500",
      badge: "bg-rose-100 text-rose-800",
    },
    cyan: {
      bg: "from-cyan-500 to-blue-600",
      text: "text-cyan-600",
      progress: "bg-cyan-500",
      badge: "bg-cyan-100 text-cyan-800",
    },
  }

  const classes = colorClasses[color]

  return (
    <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-medium text-gray-600">
          <span>{title}</span>
          <Icon className={`h-4 w-4 ${classes.text}`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">
            {typeof value === "number" ? value.toFixed(1) : value}
          </span>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{percentage.toFixed(0)}% of goal</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className="text-xs text-gray-500">
            Target: {target} {unit}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={`${classes.badge} text-xs`}>
            {percentage >= 100 ? "Goal Met!" : percentage >= 80 ? "On Track" : "Needs Focus"}
          </Badge>

          <div className={`flex items-center space-x-1 text-xs ${isPositiveTrend ? "text-green-600" : "text-red-600"}`}>
            {isPositiveTrend ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
