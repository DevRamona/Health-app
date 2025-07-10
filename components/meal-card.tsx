"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Meal } from "@/types/meal-planner"
import { Clock, Users, ChefHat } from "lucide-react"

function getMealImage(mealName: string): string {
  const mealImages: { [key: string]: string } = {
    "Avocado Toast with Eggs": "/images/avocado-toast.jpg",
    "Greek Yogurt Parfait": "/images/yogurt-parfait.jpg",
    "Vegan Smoothie Bowl": "/images/smoothie-bowl.jpg",
    "Oatmeal with Berries": "/images/oatmeal-berries.jpg",
    "Mediterranean Quinoa Salad": "/images/quinoa-salad.jpg",
    "Chicken Caesar Wrap": "/images/caesar-wrap.jpg",
    "Vegetable Stir Fry": "/images/vegetable-stir-fry.jpg",
    "Turkey and Avocado Sandwich": "/images/turkey-sandwich.jpg",
    "Grilled Salmon with Vegetables": "/images/grilled-salmon.jpg",
    "Vegetarian Pasta Primavera": "/images/pasta-primavera.jpg",
    "Chicken Stir Fry with Rice": "/images/chicken-stir-fry.jpg",
    "Lentil Curry": "/images/lentil-curry.jpg",
  }

  return mealImages[mealName] || "/images/default-meal.jpg"
}

interface MealCardProps {
  meal: Meal
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 rounded-lg mb-3 overflow-hidden">
          <img
            src={getMealImage(meal.name) || "/placeholder.svg"}
            alt={meal.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardTitle className="text-lg">{meal.name}</CardTitle>
        <CardDescription className="text-sm">{meal.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{meal.prepTime} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{meal.servings} servings</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {meal.calories} cal
          </Badge>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <ChefHat className="h-5 w-5" />
                <span>{meal.name}</span>
              </DialogTitle>
              <DialogDescription>{meal.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 rounded-lg overflow-hidden">
                <img
                  src={getMealImage(meal.name) || "/placeholder.svg"}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-semibold text-lg">{meal.prepTime}</div>
                  <div className="text-sm text-gray-600">Prep Time</div>
                </div>
                <div>
                  <div className="font-semibold text-lg">{meal.servings}</div>
                  <div className="text-sm text-gray-600">Servings</div>
                </div>
                <div>
                  <div className="font-semibold text-lg">{meal.calories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {meal.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Instructions</h3>
                <ol className="space-y-3">
                  {meal.instructions.map((instruction, index) => (
                    <li key={index} className="flex space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="pt-0.5">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
