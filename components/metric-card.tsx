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
  color: string
  trend?: number
}

const colorClasses = {
  blue: "text-cyan-600 bg-cyan-100",
  yellow: "text-amber-600 bg-amber-100",
  purple: "text-violet-600 bg-violet-100",
  green: "text-emerald-600 bg-emerald-100",
  cyan: "text-teal-600 bg-teal-100",
  red: "text-rose-600 bg-rose-100",
}

export function MetricCard({ title, value, unit, target, icon: Icon, color, trend }: MetricCardProps) {
  const progress = Math.min((value / target) * 100, 100)
  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className={`p-3 rounded-xl ${colorClass} shadow-sm`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-800">
          {value.toFixed(unit === "/10" ? 1 : 0)}
          <span className="text-lg text-gray-500">{unit}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-gray-500">
            Target: {target}
            {unit}
          </div>
          {trend && (
            <Badge
              variant={trend > 0 ? "default" : "secondary"}
              className={`text-xs ${trend > 0 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
            >
              {trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(trend)}%
            </Badge>
          )}
        </div>
        <Progress value={progress} className="mt-3 h-2" />
        <div className="text-xs text-gray-500 mt-2">{progress.toFixed(0)}% of target achieved</div>
      </CardContent>
    </Card>
  )
}
