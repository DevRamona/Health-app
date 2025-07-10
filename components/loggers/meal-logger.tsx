"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { HealthData } from "@/types/health"
import { Utensils, Plus, X } from "lucide-react"

interface MealLoggerProps {
  onSubmit: (data: HealthData) => void
}

export function MealLogger({ onSubmit }: MealLoggerProps) {
  const [mealData, setMealData] = useState({
    mealType: "" as "breakfast" | "lunch" | "dinner" | "snack" | "",
    foods: [] as string[],
    calories: 400,
    moodAfterEating: 5,
    notes: "",
  })
  const [newFood, setNewFood] = useState("")

  const addFood = () => {
    if (newFood.trim()) {
      setMealData((prev) => ({
        ...prev,
        foods: [...prev.foods, newFood.trim()],
      }))
      setNewFood("")
    }
  }

  const removeFood = (index: number) => {
    setMealData((prev) => ({
      ...prev,
      foods: prev.foods.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = () => {
    if (!mealData.mealType || mealData.foods.length === 0) return

    const healthData: HealthData = {
      id: Date.now().toString(),
      date: new Date(),
      type: "meal",
      mealType: mealData.mealType,
      foods: mealData.foods,
      calories: mealData.calories,
      moodAfterEating: mealData.moodAfterEating,
      notes: mealData.notes || undefined,
    }

    onSubmit(healthData)

    // Reset form
    setMealData({
      mealType: "",
      foods: [],
      calories: 400,
      moodAfterEating: 5,
      notes: "",
    })
  }

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-amber-50 to-orange-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img
          src="/images/healthy-meal-prep.jpg"
          alt="Healthy meal preparation"
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="relative z-10">
        <div className="mb-4 text-center">
          <img
            src="/images/healthy-nutrition.jpg"
            alt="Healthy nutrition"
            className="w-full h-32 object-cover rounded-lg shadow-lg"
          />
        </div>
        <CardTitle className="flex items-center space-x-2 text-amber-700">
          <Utensils className="h-5 w-5" />
          <span>Meal Tracker</span>
        </CardTitle>
        <CardDescription>Log your meals and how they make you feel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Meal Type</Label>
            <Select onValueChange={(value: any) => setMealData((prev) => ({ ...prev, mealType: value }))}>
              <SelectTrigger className="bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="calories">Estimated Calories</Label>
            <Input
              id="calories"
              type="number"
              value={mealData.calories}
              onChange={(e) => setMealData((prev) => ({ ...prev, calories: Number.parseInt(e.target.value) }))}
              className="bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        <div>
          <Label>Foods & Ingredients</Label>
          <div className="flex space-x-2 mt-2">
            <Input
              placeholder="Add food item..."
              value={newFood}
              onChange={(e) => setNewFood(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addFood()}
              className="bg-white/80 backdrop-blur-sm"
            />
            <Button onClick={addFood} size="icon" className="bg-amber-500 hover:bg-amber-600">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {mealData.foods.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {mealData.foods.map((food, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center space-x-1 bg-amber-100 text-amber-800"
                >
                  <span>{food}</span>
                  <X className="h-3 w-3 cursor-pointer hover:text-red-600" onClick={() => removeFood(index)} />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label>How did you feel after eating? {mealData.moodAfterEating}/10</Label>
          <Slider
            value={[mealData.moodAfterEating]}
            onValueChange={(value) => setMealData((prev) => ({ ...prev, moodAfterEating: value[0] }))}
            max={10}
            min={1}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>😵 Sluggish</span>
            <span>⚡ Energized</span>
          </div>
        </div>

        <div>
          <Label htmlFor="mealNotes">Notes (optional)</Label>
          <Textarea
            id="mealNotes"
            placeholder="How did this meal make you feel? Any digestive issues or energy changes?"
            value={mealData.notes}
            onChange={(e) => setMealData((prev) => ({ ...prev, notes: e.target.value }))}
            className="bg-white/80 backdrop-blur-sm"
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg"
          disabled={!mealData.mealType || mealData.foods.length === 0}
        >
          <Utensils className="h-4 w-4 mr-2" />
          Log Meal
        </Button>
      </CardContent>
    </Card>
  )
}
