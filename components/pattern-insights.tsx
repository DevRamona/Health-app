"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { HealthData, Recommendation } from "@/types/health"
import { detectPatterns, calculateCorrelation } from "@/lib/ai-insights"
import { TrendingUp, Brain, Calendar, Target } from "lucide-react"

interface PatternInsightsProps {
  healthData: HealthData[]
  recommendations: Recommendation[]
}

export function PatternInsights({ healthData, recommendations }: PatternInsightsProps) {
  const patterns = detectPatterns(healthData)

  const correlations = [
    {
      name: "Sleep & Mood",
      value: calculateCorrelation(healthData, "sleepDuration", "mood"),
      description: "How sleep duration affects your mood",
    },
    {
      name: "Exercise & Energy",
      value: calculateCorrelation(healthData, "workoutDuration", "energy"),
      description: "Impact of workout duration on energy levels",
    },
    {
      name: "Screen Time & Focus",
      value: calculateCorrelation(healthData, "screenTime", "focus"),
      description: "Relationship between screen time and focus",
    },
  ]

  const getCorrelationStrength = (value: number) => {
    const abs = Math.abs(value)
    if (abs > 0.7) return "Strong"
    if (abs > 0.4) return "Moderate"
    if (abs > 0.2) return "Weak"
    return "None"
  }

  const getCorrelationColor = (value: number) => {
    const abs = Math.abs(value)
    if (abs > 0.7) return "bg-emerald-100 text-emerald-800"
    if (abs > 0.4) return "bg-amber-100 text-amber-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patterns Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Detected Patterns</span>
            </CardTitle>
            <CardDescription>AI-identified patterns in your health data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patterns.length > 0 ? (
                patterns.map((pattern, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">{pattern}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Not enough data to detect patterns yet. Keep logging your health data!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Correlations Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Data Correlations</span>
            </CardTitle>
            <CardDescription>Statistical relationships between your metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {correlations.map((correlation, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{correlation.name}</p>
                    <p className="text-xs text-muted-foreground">{correlation.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getCorrelationColor(correlation.value)}>
                      {getCorrelationStrength(correlation.value)}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{correlation.value.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Weekly Summary</span>
          </CardTitle>
          <CardDescription>Your health metrics overview for the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-700">
                {healthData.filter((d) => d.type === "workout").slice(-7).length}
              </div>
              <div className="text-sm text-emerald-600">Workouts Completed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">
                {(
                  healthData
                    .filter((d) => d.sleepDuration)
                    .slice(-7)
                    .reduce((sum, d) => sum + (d.sleepDuration || 0), 0) / 7 || 0
                ).toFixed(1)}
                h
              </div>
              <div className="text-sm text-blue-600">Average Sleep</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">
                {(
                  healthData
                    .filter((d) => d.mood)
                    .slice(-7)
                    .reduce((sum, d) => sum + (d.mood || 0), 0) / 7 || 0
                ).toFixed(1)}
                /10
              </div>
              <div className="text-sm text-purple-600">Average Mood</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Priority Recommendations</span>
          </CardTitle>
          <CardDescription>AI-generated suggestions based on your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{rec.title}</h4>
                  <Badge variant="outline">{rec.confidence}% confidence</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                <div className="text-xs text-muted-foreground">Based on: {rec.basedOn.join(", ")}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
