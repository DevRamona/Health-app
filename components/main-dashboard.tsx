"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserProfile, HealthData } from "@/types/health"
import { MetricCard } from "@/components/metric-card"
import { TrendChart } from "@/components/trend-chart"
import { RecommendationCard } from "@/components/recommendation-card"
import { generateRecommendations } from "@/lib/ai-insights"
import { Activity, Moon, Zap, Brain, Heart, Droplets } from "lucide-react"

interface MainDashboardProps {
  userProfile: UserProfile
  healthData: HealthData[]
}

export function MainDashboard({ userProfile, healthData }: MainDashboardProps) {
  const recentData = healthData.slice(-7) // Last 7 days
  const recommendations = generateRecommendations(healthData, userProfile)

  // Calculate averages for recent data
  const avgSleep =
    recentData.filter((d) => d.sleepDuration).reduce((sum, d) => sum + (d.sleepDuration || 0), 0) /
      recentData.filter((d) => d.sleepDuration).length || 0

  const avgMood =
    recentData.filter((d) => d.mood).reduce((sum, d) => sum + (d.mood || 0), 0) /
      recentData.filter((d) => d.mood).length || 0

  const avgEnergy =
    recentData.filter((d) => d.energy).reduce((sum, d) => sum + (d.energy || 0), 0) /
      recentData.filter((d) => d.energy).length || 0

  const totalWorkouts = recentData.filter((d) => d.type === "workout").length
  const avgSteps =
    recentData.filter((d) => d.steps).reduce((sum, d) => sum + (d.steps || 0), 0) /
      recentData.filter((d) => d.steps).length || 0

  const avgWater =
    recentData.filter((d) => d.waterIntake).reduce((sum, d) => sum + (d.waterIntake || 0), 0) /
      recentData.filter((d) => d.waterIntake).length || 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-2xl border-0 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/dashboard-bg.jpg" alt="Dashboard background" className="w-full h-full object-cover" />
        </div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl">Good morning, {userProfile.name}! ✨</CardTitle>
          <CardDescription className="text-emerald-100">Here's your health overview for the past week</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{healthData.length}</div>
              <div className="text-sm text-emerald-100">Data Points</div>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{totalWorkouts}</div>
              <div className="text-sm text-emerald-100">Workouts</div>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{avgSleep.toFixed(1)}h</div>
              <div className="text-sm text-emerald-100">Avg Sleep</div>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{avgMood.toFixed(1)}/10</div>
              <div className="text-sm text-emerald-100">Avg Mood</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Sleep Quality"
          value={avgSleep}
          unit="hours"
          target={8}
          icon={Moon}
          color="blue"
          trend={5.2}
        />
        <MetricCard
          title="Energy Level"
          value={avgEnergy}
          unit="/10"
          target={8}
          icon={Zap}
          color="yellow"
          trend={-2.1}
        />
        <MetricCard title="Mood Score" value={avgMood} unit="/10" target={8} icon={Brain} color="purple" trend={8.3} />
        <MetricCard
          title="Daily Steps"
          value={avgSteps}
          unit="steps"
          target={10000}
          icon={Activity}
          color="green"
          trend={12.5}
        />
        <MetricCard
          title="Water Intake"
          value={avgWater}
          unit="oz"
          target={64}
          icon={Droplets}
          color="cyan"
          trend={-5.8}
        />
        <MetricCard
          title="Workouts"
          value={totalWorkouts}
          unit="this week"
          target={5}
          icon={Heart}
          color="red"
          trend={15.0}
        />
      </div>

      {/* Charts and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sleep Trend</CardTitle>
            <CardDescription>Your sleep duration over the past 2 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={healthData.filter((d) => d.sleepDuration).slice(-14)}
              dataKey="sleepDuration"
              color="#3b82f6"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood & Energy</CardTitle>
            <CardDescription>Daily mood and energy levels</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={healthData.filter((d) => d.mood || d.energy).slice(-14)}
              dataKey="mood"
              secondaryKey="energy"
              color="#8b5cf6"
              secondaryColor="#f59e0b"
            />
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">AI Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 4).map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      </div>
    </div>
  )
}
