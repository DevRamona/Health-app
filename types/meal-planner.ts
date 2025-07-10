export interface UserPreferences {
  dietPreferences: string[]
  allergies: string[]
  availableIngredients: string[]
}

export interface Meal {
  id: string
  name: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number
  servings: number
  calories: number
  category: "breakfast" | "lunch" | "dinner"
  dietTags: string[]
  allergens: string[]
}

export interface DayMealPlan {
  breakfast: Meal
  lunch: Meal
  dinner: Meal
}

export interface WeeklyMealPlan {
  days: {
    monday: DayMealPlan
    tuesday: DayMealPlan
    wednesday: DayMealPlan
    thursday: DayMealPlan
    friday: DayMealPlan
    saturday: DayMealPlan
    sunday: DayMealPlan
  }
  totalCalories: number
  generatedAt: Date
}

export interface ChatResponse {
  message: string
  suggestions?: string[]
  updatedMealPlan?: WeeklyMealPlan
}

export interface GroceryList {
  [category: string]: string[]
}
