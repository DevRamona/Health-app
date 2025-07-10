"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Recommendation } from "@/types/health"
import { Lightbulb, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react"

interface RecommendationCardProps {
  recommendation: Recommendation
  onAction?: (id: string) => void
}

export function RecommendationCard({ recommendation, onAction }: RecommendationCardProps) {
  const getIcon = () => {
    switch (recommendation.type) {
      case "insight":
        return <TrendingUp className="h-4 w-4" />
      case "suggestion":
        return <Lightbulb className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getColorClasses = () => {
    switch (recommendation.type) {
      case "insight":
        return {
          border: "border-blue-200",
          bg: "bg-blue-50",
          icon: "text-blue-600",
          badge: "bg-blue-100 text-blue-800",
        }
      case "suggestion":
        return {
          border: "border-amber-200",
          bg: "bg-amber-50",
          icon: "text-amber-600",
          badge: "bg-amber-100 text-amber-800",
        }
      case "warning":
        return {
          border: "border-red-200",
          bg: "bg-red-50",
          icon: "text-red-600",
          badge: "bg-red-100 text-red-800",
        }
      default:
        return {
          border: "border-gray-200",
          bg: "bg-gray-50",
          icon: "text-gray-600",
          badge: "bg-gray-100 text-gray-800",
        }
    }
  }

  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const colors = getColorClasses()

  return (
    <Card className={`${colors.border} ${colors.bg} border-2 hover:shadow-md transition-shadow duration-200`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center space-x-2 text-sm font-semibold">
            <span className={colors.icon}>{getIcon()}</span>
            <span>{recommendation.title}</span>
          </CardTitle>
          <div className="flex space-x-1">
            <Badge variant="outline" className={getPriorityColor()}>
              {recommendation.priority}
            </Badge>
            <Badge variant="outline" className={colors.badge}>
              {recommendation.confidence}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardDescription className="text-sm text-gray-700">{recommendation.description}</CardDescription>

        {recommendation.basedOn.length > 0 && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">Based on:</span> {recommendation.basedOn.join(", ")}
          </div>
        )}

        {recommendation.actionable && onAction && (
          <Button size="sm" variant="outline" onClick={() => onAction(recommendation.id)} className="w-full mt-2">
            Take Action
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
