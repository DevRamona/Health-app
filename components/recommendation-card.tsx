"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Recommendation } from "@/types/health"
import { Lightbulb, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react"

interface RecommendationCardProps {
  recommendation: Recommendation
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const getIcon = () => {
    switch (recommendation.type) {
      case "insight":
        return TrendingUp
      case "suggestion":
        return Lightbulb
      case "warning":
        return AlertTriangle
      default:
        return CheckCircle
    }
  }

  const getColor = () => {
    switch (recommendation.type) {
      case "insight":
        return "bg-blue-100 text-blue-600"
      case "suggestion":
        return "bg-yellow-100 text-yellow-600"
      case "warning":
        return "bg-red-100 text-red-600"
      default:
        return "bg-green-100 text-green-600"
    }
  }

  const Icon = getIcon()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`p-2 rounded-full ${getColor()}`}>
            <Icon className="h-4 w-4" />
          </div>
          <Badge variant="outline" className="text-xs">
            {recommendation.confidence}% confidence
          </Badge>
        </div>
        <CardTitle className="text-lg">{recommendation.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{recommendation.description}</CardDescription>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Based on: {recommendation.basedOn.join(", ")}</div>

          {recommendation.actionable && (
            <Button size="sm" variant="outline" className="w-full bg-transparent">
              Take Action
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
