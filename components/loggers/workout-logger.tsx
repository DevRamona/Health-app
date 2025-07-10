"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import type { HealthData } from "@/types/health"
import { Dumbbell, Timer } from "lucide-react"

interface WorkoutLoggerProps {
  onSubmit: (data: HealthData) => void
}

const WORKOUT_TYPES = [
  "Cardio",
  "Strength Training",
  "Yoga",
  "Running",
  "Cycling",
  "Swimming",
  "HIIT",
  "Pilates",
  "Walking",
  "Sports",
  "Other",
]

export function WorkoutLogger({ onSubmit }: WorkoutLoggerProps) {
  const [workoutData, setWorkoutData] = useState({
    workoutType: "",
    workoutDuration: 30,
    workoutIntensity: 5,
    caloriesBurned: 200,
    notes: "",
  })

  const handleSubmit = () => {
    if (!workoutData.workoutType) return

    const healthData: HealthData = {
      id: Date.now().toString(),
      date: new Date(),
      type: "workout",
      workoutType: workoutData.workoutType,
      workoutDuration: workoutData.workoutDuration,
      workoutIntensity: workoutData.workoutIntensity,
      caloriesBurned: workoutData.caloriesBurned,
      notes: workoutData.notes || undefined,
    }

    onSubmit(healthData)

    // Reset form
    setWorkoutData({
      workoutType: "",
      workoutDuration: 30,
      workoutIntensity: 5,
      caloriesBurned: 200,
      notes: "",
    })
  }

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-rose-50 to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src="/images/gym-equipment.jpg" alt="Gym equipment" className="w-full h-full object-cover" />
      </div>
      <CardHeader className="relative z-10">
        <div className="mb-4 text-center">
          <img
            src="/images/workout-fitness.jpg"
            alt="Workout and fitness"
            className="w-full h-32 object-cover rounded-lg shadow-lg"
          />
        </div>
        <CardTitle className="flex items-center space-x-2 text-rose-700">
          <Dumbbell className="h-5 w-5" />
          <span>Workout Logger</span>
        </CardTitle>
        <CardDescription>Track your exercise sessions and performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Workout Type</Label>
            <Select onValueChange={(value) => setWorkoutData((prev) => ({ ...prev, workoutType: value }))}>
              <SelectTrigger className="bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Select workout type" />
              </SelectTrigger>
              <SelectContent>
                {WORKOUT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="calories">Calories Burned</Label>
            <Input
              id="calories"
              type="number"
              value={workoutData.caloriesBurned}
              onChange={(e) => setWorkoutData((prev) => ({ ...prev, caloriesBurned: Number.parseInt(e.target.value) }))}
              className="bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        <div>
          <Label>Duration: {workoutData.workoutDuration} minutes</Label>
          <Slider
            value={[workoutData.workoutDuration]}
            onValueChange={(value) => setWorkoutData((prev) => ({ ...prev, workoutDuration: value[0] }))}
            max={180}
            min={5}
            step={5}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Intensity: {workoutData.workoutIntensity}/10</Label>
          <Slider
            value={[workoutData.workoutIntensity]}
            onValueChange={(value) => setWorkoutData((prev) => ({ ...prev, workoutIntensity: value[0] }))}
            max={10}
            min={1}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Light</span>
            <span>Maximum</span>
          </div>
        </div>

        <div>
          <Label htmlFor="workoutNotes">Notes (optional)</Label>
          <Textarea
            id="workoutNotes"
            placeholder="How did the workout feel? Any achievements or challenges?"
            value={workoutData.notes}
            onChange={(e) => setWorkoutData((prev) => ({ ...prev, notes: e.target.value }))}
            className="bg-white/80 backdrop-blur-sm"
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 shadow-lg"
          disabled={!workoutData.workoutType}
        >
          <Timer className="h-4 w-4 mr-2" />
          Log Workout
        </Button>
      </CardContent>
    </Card>
  )
}
