"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserProfile, HealthData } from "@/types/health"
import { TrendChart } from "@/components/trend-chart"
import { CorrelationChart } from "@/components/correlation-chart"
import { PatternInsights } from "@/components/pattern-insights"
import { generateRecommendations } from "@/lib/ai-insights"
import { Brain, Target } from "lucide-react"

interface AnalyticsViewProps {
  healthData: HealthData[]
  userProfile: UserProfile
}

export function AnalyticsView({ healthData, userProfile }: AnalyticsViewProps) {
  const recommendations = generateRecommendations(healthData, userProfile)

  // Filter data by type for different charts
  const sleepData = healthData.filter((d) => d.sleepDuration).slice(-30)
  const moodData = healthData.filter((d) => d.mood).slice(-30)
  const workoutData = healthData.filter((d) => d.type === "workout").slice(-30)
  const biometricData = healthData.filter((d) => d.steps || d.weight).slice(-30)

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/analytics-dashboard.jpg" alt="Analytics dashboard" className="w-full h-full object-cover" />
        </div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <Brain className="h-6 w-6" />
            <span>Health Analytics & Insights</span>
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Deep dive into your health patterns and correlations
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sleep Trends (30 days)</CardTitle>
                <CardDescription>Duration and quality over time</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendChart
                  data={sleepData}
                  dataKey="sleepDuration"
                  secondaryKey="sleepQuality"
                  color="#3b82f6"
                  secondaryColor="#8b5cf6"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mood & Energy</CardTitle>
                <CardDescription>Mental state tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendChart
                  data={moodData}
                  dataKey="mood"
                  secondaryKey="energy"
                  color="#f59e0b"
                  secondaryColor="#10b981"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Levels</CardTitle>
                <CardDescription>Steps and workout frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendChart data={biometricData} dataKey="steps" color="#ef4444" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workout Intensity</CardTitle>
                <CardDescription>Exercise patterns and intensity</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendChart
                  data={workoutData}
                  dataKey="workoutIntensity"
                  secondaryKey="workoutDuration"
                  color="#8b5cf6"
                  secondaryColor="#06b6d4"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sleep vs Mood Correlation</CardTitle>
                <CardDescription>How sleep affects your mood</CardDescription>
              </CardHeader>
              <CardContent>
                <CorrelationChart
                  data={healthData}
                  xKey="sleepDuration"
                  yKey="mood"
                  xLabel="Sleep Duration (hours)"
                  yLabel="Mood Score"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exercise vs Energy</CardTitle>
                <CardDescription>Workout impact on energy levels</CardDescription>
              </CardHeader>
              <CardContent>
                <CorrelationChart
                  data={healthData}
                  xKey="workoutDuration"
                  yKey="energy"
                  xLabel="Workout Duration (min)"
                  yLabel="Energy Level"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Steps vs Sleep Quality</CardTitle>
                <CardDescription>Activity impact on sleep</CardDescription>
              </CardHeader>
              <CardContent>
                <CorrelationChart
                  data={healthData}
                  xKey="steps"
                  yKey="sleepQuality"
                  xLabel="Daily Steps"
                  yLabel="Sleep Quality"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Screen Time vs Focus</CardTitle>
                <CardDescription>Digital wellness correlation</CardDescription>
              </CardHeader>
              <CardContent>
                <CorrelationChart
                  data={healthData}
                  xKey="screenTime"
                  yKey="focus"
                  xLabel="Screen Time (hours)"
                  yLabel="Focus Score"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns">
          <PatternInsights healthData={healthData} recommendations={recommendations} />
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Sleep Goal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Target: 8 hours</span>
                    <span>
                      Avg:{" "}
                      {(sleepData.reduce((sum, d) => sum + (d.sleepDuration || 0), 0) / sleepData.length || 0).toFixed(
                        1,
                      )}
                      h
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {sleepData.filter((d) => (d.sleepDuration || 0) >= 8).length} of {sleepData.length} days met goal
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Activity Goal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Target: 10,000 steps</span>
                    <span>
                      Avg:{" "}
                      {Math.round(
                        biometricData.reduce((sum, d) => sum + (d.steps || 0), 0) / biometricData.length || 0,
                      )}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {biometricData.filter((d) => (d.steps || 0) >= 10000).length} of {biometricData.length} days met
                    goal
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Workout Goal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Target: 5 per week</span>
                    <span>This week: {workoutData.slice(-7).length}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {workoutData.slice(-7).length >= 5
                      ? "Goal achieved!"
                      : `${5 - workoutData.slice(-7).length} more needed`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
