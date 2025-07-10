"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SleepLogger } from "@/components/loggers/sleep-logger"
import { WorkoutLogger } from "@/components/loggers/workout-logger"
import { MoodLogger } from "@/components/loggers/mood-logger"
import { MealLogger } from "@/components/loggers/meal-logger"
import { BiometricLogger } from "@/components/loggers/biometric-logger"
import type { HealthData } from "@/types/health"
import { Moon, Dumbbell, Brain, Utensils, Activity, Smartphone } from "lucide-react"

interface DataInputHubProps {
  onDataUpdate: (data: HealthData) => void
}

export function DataInputHub({ onDataUpdate }: DataInputHubProps) {
  const [activeLogger, setActiveLogger] = useState("sleep")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Log Your Health Data</CardTitle>
          <CardDescription>Track your daily metrics to get personalized insights and recommendations</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeLogger} onValueChange={setActiveLogger}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-white shadow-lg border-0">
          <TabsTrigger
            value="sleep"
            className="flex items-center space-x-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
          >
            <Moon className="h-4 w-4" />
            <span className="hidden sm:inline">Sleep</span>
          </TabsTrigger>
          <TabsTrigger
            value="workout"
            className="flex items-center space-x-2 data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700"
          >
            <Dumbbell className="h-4 w-4" />
            <span className="hidden sm:inline">Workout</span>
          </TabsTrigger>
          <TabsTrigger
            value="mood"
            className="flex items-center space-x-2 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700"
          >
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Mood</span>
          </TabsTrigger>
          <TabsTrigger
            value="meal"
            className="flex items-center space-x-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
          >
            <Utensils className="h-4 w-4" />
            <span className="hidden sm:inline">Meal</span>
          </TabsTrigger>
          <TabsTrigger
            value="biometric"
            className="flex items-center space-x-2 data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700"
          >
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Vitals</span>
          </TabsTrigger>
          <TabsTrigger
            value="devices"
            className="flex items-center space-x-2 data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700"
          >
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Devices</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sleep">
          <SleepLogger onSubmit={onDataUpdate} />
        </TabsContent>

        <TabsContent value="workout">
          <WorkoutLogger onSubmit={onDataUpdate} />
        </TabsContent>

        <TabsContent value="mood">
          <MoodLogger onSubmit={onDataUpdate} />
        </TabsContent>

        <TabsContent value="meal">
          <MealLogger onSubmit={onDataUpdate} />
        </TabsContent>

        <TabsContent value="biometric">
          <BiometricLogger onSubmit={onDataUpdate} />
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Device Integration</CardTitle>
              <CardDescription>Connect your health devices and apps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <div className="text-lg">📱</div>
                  <div>Apple Health</div>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <div className="text-lg">🏃</div>
                  <div>Google Fit</div>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <div className="text-lg">⌚</div>
                  <div>Fitbit</div>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <div className="text-lg">💍</div>
                  <div>Oura Ring</div>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Device integration coming soon! For now, please use manual logging.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
