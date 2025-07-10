"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { WeeklyMealPlan } from "@/types/meal-planner"
import { MealCard } from "@/components/meal-card"
import { RefreshCw, Calendar } from "lucide-react"

interface MealPlannerDashboardProps {
  weeklyMealPlan: WeeklyMealPlan | null
  onRegeneratePlan: () => void
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function MealPlannerDashboard({ weeklyMealPlan, onRegeneratePlan }: MealPlannerDashboardProps) {
  if (!weeklyMealPlan) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No meal plan generated yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Weekly Meal Plan</h2>
          <p className="text-gray-600">Personalized meals based on your preferences</p>
        </div>
        <Button onClick={onRegeneratePlan} className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>Regenerate Plan</span>
        </Button>
      </div>

      <div className="grid gap-6">
        {DAYS_OF_WEEK.map((day) => {
          const dayPlan = weeklyMealPlan.days[day.toLowerCase() as keyof typeof weeklyMealPlan.days]
          return (
            <Card key={day} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardTitle className="flex items-center justify-between">
                  <span>{day}</span>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {dayPlan.breakfast.calories + dayPlan.lunch.calories + dayPlan.dinner.calories} cal
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-orange-600 mb-2">Breakfast</h4>
                    <MealCard meal={dayPlan.breakfast} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-600 mb-2">Lunch</h4>
                    <MealCard meal={dayPlan.lunch} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-600 mb-2">Dinner</h4>
                    <MealCard meal={dayPlan.dinner} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
