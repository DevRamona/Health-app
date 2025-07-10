"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import type { HealthData } from "@/types/health"
import { Moon, Clock } from "lucide-react"

interface SleepLoggerProps {
  onSubmit: (data: HealthData) => void
}

export function SleepLogger({ onSubmit }: SleepLoggerProps) {
  const [sleepData, setSleepData] = useState({
    sleepDuration: 8,
    sleepQuality: 7,
    bedTime: "22:00",
    wakeTime: "06:00",
    notes: "",
  })

  const handleSubmit = () => {
    const healthData: HealthData = {
      id: Date.now().toString(),
      date: new Date(),
      type: "sleep",
      sleepDuration: sleepData.sleepDuration,
      sleepQuality: sleepData.sleepQuality,
      bedTime: sleepData.bedTime,
      wakeTime: sleepData.wakeTime,
      notes: sleepData.notes || undefined,
    }

    onSubmit(healthData)

    // Reset form
    setSleepData({
      sleepDuration: 8,
      sleepQuality: 7,
      bedTime: "22:00",
      wakeTime: "06:00",
      notes: "",
    })
  }

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src="/images/sleep-bedroom.jpg" alt="Sleep environment" className="w-full h-full object-cover" />
      </div>
      <CardHeader className="relative z-10">
        <div className="mb-4 text-center">
          <img
            src="/images/sleep-tracking.jpg"
            alt="Sleep tracking"
            className="w-full h-32 object-cover rounded-lg shadow-lg"
          />
        </div>
        <CardTitle className="flex items-center space-x-2 text-emerald-700">
          <Moon className="h-5 w-5" />
          <span>Sleep Tracker</span>
        </CardTitle>
        <CardDescription>Log your sleep duration and quality for better insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bedTime">Bed Time</Label>
            <Input
              id="bedTime"
              type="time"
              value={sleepData.bedTime}
              onChange={(e) => setSleepData((prev) => ({ ...prev, bedTime: e.target.value }))}
              className="bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div>
            <Label htmlFor="wakeTime">Wake Time</Label>
            <Input
              id="wakeTime"
              type="time"
              value={sleepData.wakeTime}
              onChange={(e) => setSleepData((prev) => ({ ...prev, wakeTime: e.target.value }))}
              className="bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        <div>
          <Label>Sleep Duration: {sleepData.sleepDuration} hours</Label>
          <Slider
            value={[sleepData.sleepDuration]}
            onValueChange={(value) => setSleepData((prev) => ({ ...prev, sleepDuration: value[0] }))}
            max={12}
            min={1}
            step={0.5}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Sleep Quality: {sleepData.sleepQuality}/10</Label>
          <Slider
            value={[sleepData.sleepQuality]}
            onValueChange={(value) => setSleepData((prev) => ({ ...prev, sleepQuality: value[0] }))}
            max={10}
            min={1}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        <div>
          <Label htmlFor="sleepNotes">Notes (optional)</Label>
          <Textarea
            id="sleepNotes"
            placeholder="How did you sleep? Any factors that affected your sleep?"
            value={sleepData.notes}
            onChange={(e) => setSleepData((prev) => ({ ...prev, notes: e.target.value }))}
            className="bg-white/80 backdrop-blur-sm"
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg"
        >
          <Clock className="h-4 w-4 mr-2" />
          Log Sleep Data
        </Button>
      </CardContent>
    </Card>
  )
}
