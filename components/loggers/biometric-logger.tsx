"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { HealthData } from "@/types/health"
import { Activity, Heart } from "lucide-react"

interface BiometricLoggerProps {
  onSubmit: (data: HealthData) => void
}

export function BiometricLogger({ onSubmit }: BiometricLoggerProps) {
  const [biometricData, setBiometricData] = useState({
    weight: "",
    heartRate: "",
    bloodPressure: "",
    steps: "",
    waterIntake: "",
    screenTime: "",
    notes: "",
  })

  const handleSubmit = () => {
    const healthData: HealthData = {
      id: Date.now().toString(),
      date: new Date(),
      type: "biometric",
      weight: biometricData.weight ? Number.parseFloat(biometricData.weight) : undefined,
      heartRate: biometricData.heartRate ? Number.parseInt(biometricData.heartRate) : undefined,
      bloodPressure: biometricData.bloodPressure || undefined,
      steps: biometricData.steps ? Number.parseInt(biometricData.steps) : undefined,
      waterIntake: biometricData.waterIntake ? Number.parseInt(biometricData.waterIntake) : undefined,
      screenTime: biometricData.screenTime ? Number.parseInt(biometricData.screenTime) : undefined,
      notes: biometricData.notes || undefined,
    }

    onSubmit(healthData)

    // Reset form
    setBiometricData({
      weight: "",
      heartRate: "",
      bloodPressure: "",
      steps: "",
      waterIntake: "",
      screenTime: "",
      notes: "",
    })
  }

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-teal-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src="/images/health-monitoring.jpg" alt="Health monitoring" className="w-full h-full object-cover" />
      </div>
      <CardHeader className="relative z-10">
        <div className="mb-4 text-center">
          <img
            src="/images/health-vitals.jpg"
            alt="Health vitals monitoring"
            className="w-full h-32 object-cover rounded-lg shadow-lg"
          />
        </div>
        <CardTitle className="flex items-center space-x-2 text-teal-700">
          <Activity className="h-5 w-5" />
          <span>Biometric Data</span>
        </CardTitle>
        <CardDescription>Track your vital signs and daily metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Weight (lbs)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="150"
              value={biometricData.weight}
              onChange={(e) => setBiometricData((prev) => ({ ...prev, weight: e.target.value }))}
              className="bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div>
            <Label htmlFor="heartRate">Resting Heart Rate (bpm)</Label>
            <Input
              id="heartRate"
              type="number"
              placeholder="70"
              value={biometricData.heartRate}
              onChange={(e) => setBiometricData((prev) => ({ ...prev, heartRate: e.target.value }))}
              className="bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div>
            <Label htmlFor="bloodPressure">Blood Pressure</Label>
            <Input
              id="bloodPressure"
              placeholder="120/80"
              value={biometricData.bloodPressure}
              onChange={(e) => setBiometricData((prev) => ({ ...prev, bloodPressure: e.target.value }))}
              className="bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div>
            <Label htmlFor="steps">Daily Steps</Label>
            <Input
              id="steps"
              type="number"
              placeholder="8000"
              value={biometricData.steps}
              onChange={(e) => setBiometricData((prev) => ({ ...prev, steps: e.target.value }))}
              className="bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div>
            <Label htmlFor="waterIntake">Water Intake (oz)</Label>
            <Input
              id="waterIntake"
              type="number"
              placeholder="64"
              value={biometricData.waterIntake}
              onChange={(e) => setBiometricData((prev) => ({ ...prev, waterIntake: e.target.value }))}
              className="bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div>
            <Label htmlFor="screenTime">Screen Time (hours)</Label>
            <Input
              id="screenTime"
              type="number"
              placeholder="6"
              value={biometricData.screenTime}
              onChange={(e) => setBiometricData((prev) => ({ ...prev, screenTime: e.target.value }))}
              className="bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="biometricNotes">Notes (optional)</Label>
          <Textarea
            id="biometricNotes"
            placeholder="Any observations about your vitals or daily metrics?"
            value={biometricData.notes}
            onChange={(e) => setBiometricData((prev) => ({ ...prev, notes: e.target.value }))}
            className="bg-white/80 backdrop-blur-sm"
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 shadow-lg"
        >
          <Heart className="h-4 w-4 mr-2" />
          Log Biometric Data
        </Button>
      </CardContent>
    </Card>
  )
}
