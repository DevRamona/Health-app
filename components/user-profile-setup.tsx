"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { UserProfile } from "@/types/health"
import { User, Target, AlertTriangle } from "lucide-react"

interface UserProfileSetupProps {
  onComplete: (profile: UserProfile) => void
}

const FITNESS_GOALS = [
  "Lose Weight",
  "Build Muscle",
  "Improve Endurance",
  "Increase Focus",
  "Better Sleep",
  "Reduce Stress",
  "General Health",
  "Athletic Performance",
]

const MEDICAL_CONDITIONS = [
  "Insomnia",
  "Anxiety",
  "Depression",
  "Diabetes",
  "High Blood Pressure",
  "Heart Disease",
  "Arthritis",
  "Chronic Fatigue",
  "ADHD",
  "Thyroid Issues",
]

export function UserProfileSetup({ onComplete }: UserProfileSetupProps) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    medicalConditions: [],
  })

  const handleBasicInfoSubmit = () => {
    if (profile.name && profile.age && profile.weight && profile.height) {
      setStep(2)
    }
  }

  const handleGoalSubmit = () => {
    if (profile.fitnessGoal) {
      setStep(3)
    }
  }

  const handleConditionToggle = (condition: string, checked: boolean) => {
    setProfile((prev) => ({
      ...prev,
      medicalConditions: checked
        ? [...(prev.medicalConditions || []), condition]
        : (prev.medicalConditions || []).filter((c) => c !== condition),
    }))
  }

  const handleComplete = () => {
    const completeProfile: UserProfile = {
      id: Date.now().toString(),
      name: profile.name!,
      age: profile.age!,
      weight: profile.weight!,
      height: profile.height!,
      fitnessGoal: profile.fitnessGoal!,
      medicalConditions: profile.medicalConditions || [],
      createdAt: new Date(),
    }
    onComplete(completeProfile)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-1 mx-2 ${step > stepNumber ? "bg-emerald-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Step {step} of 3: {step === 1 ? "Basic Info" : step === 2 ? "Fitness Goals" : "Health Conditions"}
          </p>
        </div>
      </div>

      {step === 1 && (
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="mb-6 text-center">
              <img
                src="/images/health-profile.jpg"
                alt="Health profile setup"
                className="w-full h-40 object-cover rounded-lg mb-4 shadow-lg"
              />
            </div>
            <CardTitle className="flex items-center space-x-2 text-emerald-700">
              <User className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
            <CardDescription>Tell us about yourself to personalize your health insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={profile.name || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={profile.age || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, age: Number.parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="150"
                  value={profile.weight || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, weight: Number.parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="height">Height (inches)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="68"
                  value={profile.height || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, height: Number.parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleBasicInfoSubmit}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="mb-6 text-center">
              <img
                src="/images/fitness-goals.jpg"
                alt="Fitness goals"
                className="w-full h-40 object-cover rounded-lg mb-4 shadow-lg"
              />
            </div>
            <CardTitle className="flex items-center space-x-2 text-emerald-700">
              <Target className="h-5 w-5" />
              <span>Fitness Goals</span>
            </CardTitle>
            <CardDescription>What's your primary health and fitness objective?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Primary Goal</Label>
              <Select onValueChange={(value) => setProfile((prev) => ({ ...prev, fitnessGoal: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your main goal" />
                </SelectTrigger>
                <SelectContent>
                  {FITNESS_GOALS.map((goal) => (
                    <SelectItem key={goal} value={goal}>
                      {goal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleGoalSubmit}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="mb-6 text-center">
              <img
                src="/images/health-conditions.jpg"
                alt="Health conditions"
                className="w-full h-40 object-cover rounded-lg mb-4 shadow-lg"
              />
            </div>
            <CardTitle className="flex items-center space-x-2 text-emerald-700">
              <AlertTriangle className="h-5 w-5" />
              <span>Health Conditions</span>
            </CardTitle>
            <CardDescription>
              Select any conditions that might affect your health optimization (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {MEDICAL_CONDITIONS.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={profile.medicalConditions?.includes(condition)}
                    onCheckedChange={(checked) => handleConditionToggle(condition, checked as boolean)}
                  />
                  <Label htmlFor={condition} className="text-sm">
                    {condition}
                  </Label>
                </div>
              ))}
            </div>

            {profile.medicalConditions && profile.medicalConditions.length > 0 && (
              <div className="space-y-2">
                <Label>Selected conditions:</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.medicalConditions.map((condition) => (
                    <Badge key={condition} variant="secondary">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                Complete Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
