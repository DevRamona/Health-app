"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { UserPreferences } from "@/types/meal-planner"
import { X } from "lucide-react"

interface OnboardingFlowProps {
  onComplete: (preferences: UserPreferences) => void
}

const DIET_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Keto",
  "Paleo",
  "Mediterranean",
  "Low-Carb",
  "Gluten-Free",
  "Dairy-Free",
]

const ALLERGY_OPTIONS = [
  "Gluten",
  "Nuts",
  "Dairy",
  "Eggs",
  "Soy",
  "Shellfish",
  "Fish",
  "Sesame",
  "Peanuts",
  "Tree Nuts",
]

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    dietPreferences: [],
    allergies: [],
    availableIngredients: [],
  })
  const [newIngredient, setNewIngredient] = useState("")

  const handleDietChange = (diet: string, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      dietPreferences: checked
        ? [...(prev.dietPreferences || []), diet]
        : (prev.dietPreferences || []).filter((d) => d !== diet),
    }))
  }

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      allergies: checked ? [...(prev.allergies || []), allergy] : (prev.allergies || []).filter((a) => a !== allergy),
    }))
  }

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setPreferences((prev) => ({
        ...prev,
        availableIngredients: [...(prev.availableIngredients || []), newIngredient.trim()],
      }))
      setNewIngredient("")
    }
  }

  const removeIngredient = (ingredient: string) => {
    setPreferences((prev) => ({
      ...prev,
      availableIngredients: (prev.availableIngredients || []).filter((i) => i !== ingredient),
    }))
  }

  const handleComplete = () => {
    onComplete(preferences as UserPreferences)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-1 mx-2 ${step > stepNumber ? "bg-orange-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Step {step} of 3:{" "}
            {step === 1 ? "Diet Preferences" : step === 2 ? "Food Allergies" : "Available Ingredients"}
          </p>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>What are your dietary preferences?</CardTitle>
            <CardDescription>Select all that apply to help us suggest the best meals for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-6 text-center">
              <img
                src="/images/healthy-foods.jpg"
                alt="Healthy food options"
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {DIET_OPTIONS.map((diet) => (
                <div key={diet} className="flex items-center space-x-2">
                  <Checkbox
                    id={diet}
                    checked={preferences.dietPreferences?.includes(diet)}
                    onCheckedChange={(checked) => handleDietChange(diet, checked as boolean)}
                  />
                  <Label htmlFor={diet} className="text-sm font-medium">
                    {diet}
                  </Label>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <div></div>
              <Button onClick={() => setStep(2)}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Do you have any food allergies?</CardTitle>
            <CardDescription>Help us avoid ingredients that might cause allergic reactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-6 text-center">
              <img
                src="/images/allergy-foods.jpg"
                alt="Common allergen foods"
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {ALLERGY_OPTIONS.map((allergy) => (
                <div key={allergy} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergy}
                    checked={preferences.allergies?.includes(allergy)}
                    onCheckedChange={(checked) => handleAllergyChange(allergy, checked as boolean)}
                  />
                  <Label htmlFor={allergy} className="text-sm font-medium">
                    {allergy}
                  </Label>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>What ingredients do you currently have?</CardTitle>
            <CardDescription>Add ingredients you have at home so we can suggest meals using them</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-6 text-center">
              <img
                src="/images/fresh-ingredients.jpg"
                alt="Fresh cooking ingredients"
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="e.g., eggs, tomatoes, chicken"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addIngredient()}
              />
              <Button onClick={addIngredient}>Add</Button>
            </div>

            {preferences.availableIngredients && preferences.availableIngredients.length > 0 && (
              <div className="space-y-2">
                <Label>Your ingredients:</Label>
                <div className="flex flex-wrap gap-2">
                  {preferences.availableIngredients.map((ingredient) => (
                    <Badge key={ingredient} variant="secondary" className="flex items-center space-x-1">
                      <span>{ingredient}</span>
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeIngredient(ingredient)} />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handleComplete}>Complete Setup</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
