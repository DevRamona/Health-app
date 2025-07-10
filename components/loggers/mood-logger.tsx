"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { HealthData } from "@/types/health"
import { Brain, Heart, Zap, Target } from "lucide-react"

interface MoodLoggerProps {
  onSubmit: (data: HealthData) => void
}

const MOOD_TAGS = [
  "Happy",
  "Sad",
  "Anxious",
  "Calm",
  "Energetic",
  "Tired",
  "Focused",
  "Distracted",
  "Motivated",
  "Stressed",
  "Relaxed",
  "Overwhelmed",
]

export function MoodLogger({ onSubmit }: MoodLoggerProps) {
  const [moodData, setMoodData] = useState({
    mood: 5,
    stress: 5,
    focus: 5,
    anxiety: 5,
    energy: 5,
    tags: [] as string[],
    notes: "",
  })

  const toggleTag = (tag: string) => {
    setMoodData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const handleSubmit = () => {
    const healthData: HealthData = {
      id: Date.now().toString(),
      date: new Date(),
      type: "mood",
      mood: moodData.mood,
      stress: moodData.stress,
      focus: moodData.focus,
      anxiety: moodData.anxiety,
      energy: moodData.energy,
      tags: moodData.tags.length > 0 ? moodData.tags : undefined,
      notes: moodData.notes || undefined,
    }

    onSubmit(healthData)

    // Reset form
    setMoodData({
      mood: 5,
      stress: 5,
      focus: 5,
      anxiety: 5,
      energy: 5,
      tags: [],
      notes: "",
    })
  }

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <img src="/images/mood-wellness.jpg" alt="Mood wellness background" className="w-full h-full object-cover" />
      </div>

      <CardHeader className="relative z-10">
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="relative">
            <img
              src="/images/mood-energy-tracking.jpg"
              alt="Mood tracking visualization"
              className="w-full h-24 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 to-transparent rounded-lg"></div>
          </div>
          <div className="relative">
            <img
              src="/images/energy-boost.jpg"
              alt="Energy and vitality"
              className="w-full h-24 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-600/20 to-transparent rounded-lg"></div>
          </div>
        </div>

        <CardTitle className="flex items-center space-x-2 text-violet-700">
          <Brain className="h-5 w-5" />
          <span>Mood & Energy Tracking</span>
        </CardTitle>
        <CardDescription>Monitor your emotional well-being and energy levels throughout the day</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mood Section */}
          <div className="space-y-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-violet-200/50">
            <div className="flex items-center space-x-2 mb-3">
              <Heart className="h-4 w-4 text-violet-600" />
              <h3 className="font-semibold text-violet-700">Mood Assessment</h3>
            </div>

            <div>
              <Label className="flex items-center justify-between">
                <span>Overall Mood</span>
                <span className="text-violet-600 font-semibold">{moodData.mood}/10</span>
              </Label>
              <Slider
                value={[moodData.mood]}
                onValueChange={(value) => setMoodData((prev) => ({ ...prev, mood: value[0] }))}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>😢 Poor</span>
                <span>😊 Great</span>
              </div>
            </div>

            <div>
              <Label className="flex items-center justify-between">
                <span>Stress Level</span>
                <span className="text-red-600 font-semibold">{moodData.stress}/10</span>
              </Label>
              <Slider
                value={[moodData.stress]}
                onValueChange={(value) => setMoodData((prev) => ({ ...prev, stress: value[0] }))}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>😌 Calm</span>
                <span>😰 High</span>
              </div>
            </div>
          </div>

          {/* Energy Section */}
          <div className="space-y-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-amber-200/50">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold text-amber-700">Energy Assessment</h3>
            </div>

            <div>
              <Label className="flex items-center justify-between">
                <span>Energy Level</span>
                <span className="text-amber-600 font-semibold">{moodData.energy}/10</span>
              </Label>
              <Slider
                value={[moodData.energy]}
                onValueChange={(value) => setMoodData((prev) => ({ ...prev, energy: value[0] }))}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>🔋 Low</span>
                <span>⚡ High</span>
              </div>
            </div>

            <div>
              <Label className="flex items-center justify-between">
                <span>Mental Focus</span>
                <span className="text-blue-600 font-semibold">{moodData.focus}/10</span>
              </Label>
              <Slider
                value={[moodData.focus]}
                onValueChange={(value) => setMoodData((prev) => ({ ...prev, focus: value[0] }))}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>🌫️ Scattered</span>
                <span>🎯 Sharp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mental Clarity Section */}
        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-blue-200/50">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="h-4 w-4 text-blue-600" />
            <h3 className="font-semibold text-blue-700">Mental Clarity</h3>
          </div>

          <div className="mb-4">
            <img
              src="/images/mental-clarity.jpg"
              alt="Mental clarity and focus"
              className="w-full h-20 object-cover rounded-lg shadow-md"
            />
          </div>

          <div>
            <Label className="flex items-center justify-between">
              <span>Anxiety Level</span>
              <span className="text-purple-600 font-semibold">{moodData.anxiety}/10</span>
            </Label>
            <Slider
              value={[moodData.anxiety]}
              onValueChange={(value) => setMoodData((prev) => ({ ...prev, anxiety: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>🧘 Peaceful</span>
              <span>😟 Anxious</span>
            </div>
          </div>
        </div>

        <div>
          <Label>How are you feeling? (Select all that apply)</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {MOOD_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={moodData.tags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
                  moodData.tags.includes(tag)
                    ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white"
                    : "hover:bg-violet-50"
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="moodNotes">Reflection Notes (optional)</Label>
          <Textarea
            id="moodNotes"
            placeholder="What's influencing your mood and energy today? Any specific thoughts, events, or patterns you've noticed?"
            value={moodData.notes}
            onChange={(e) => setMoodData((prev) => ({ ...prev, notes: e.target.value }))}
            className="bg-white/80 backdrop-blur-sm border-violet-200/50 focus:border-violet-400"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-lg transform hover:scale-[1.02] transition-all duration-200"
        >
          <Heart className="h-4 w-4 mr-2" />
          Log Mood & Energy Data
        </Button>
      </CardContent>
    </Card>
  )
}
