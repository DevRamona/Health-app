import type { UserPreferences, WeeklyMealPlan, DayMealPlan, Meal } from "@/types/meal-planner"
import { MEAL_DATABASE } from "./meal-database"

export function generateWeeklyMealPlan(preferences: UserPreferences): WeeklyMealPlan {
  const filteredMeals = filterMealsByPreferences(MEAL_DATABASE, preferences)

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const
  const weeklyPlan: any = { days: {} }

  let totalCalories = 0

  days.forEach((day) => {
    const dayPlan = generateDayMealPlan(filteredMeals, preferences)
    weeklyPlan.days[day] = dayPlan
    totalCalories += dayPlan.breakfast.calories + dayPlan.lunch.calories + dayPlan.dinner.calories
  })

  return {
    ...weeklyPlan,
    totalCalories,
    generatedAt: new Date(),
  }
}

function filterMealsByPreferences(meals: Meal[], preferences: UserPreferences): Meal[] {
  return meals.filter((meal) => {
    // Filter by diet preferences
    if (preferences.dietPreferences.length > 0) {
      const hasMatchingDiet = preferences.dietPreferences.some(
        (diet) => meal.dietTags.includes(diet) || (diet === "Vegetarian" && meal.dietTags.includes("Vegan")),
      )
      if (!hasMatchingDiet && !meal.dietTags.includes("")) {
        // If user has diet preferences but meal doesn't match any, exclude it
        // unless it's a general meal (no specific diet tags)
        const isGeneralMeal = meal.dietTags.length === 0
        if (!isGeneralMeal) return false
      }
    }

    // Filter by allergies
    if (preferences.allergies.length > 0) {
      const hasAllergen = preferences.allergies.some((allergy) => meal.allergens.includes(allergy))
      if (hasAllergen) return false
    }

    return true
  })
}

function generateDayMealPlan(availableMeals: Meal[], preferences: UserPreferences): DayMealPlan {
  const breakfastMeals = availableMeals.filter((meal) => meal.category === "breakfast")
  const lunchMeals = availableMeals.filter((meal) => meal.category === "lunch")
  const dinnerMeals = availableMeals.filter((meal) => meal.category === "dinner")

  // Prioritize meals that use available ingredients
  const prioritizeMealsWithAvailableIngredients = (meals: Meal[]) => {
    if (preferences.availableIngredients.length === 0) return meals

    return meals.sort((a, b) => {
      const aMatches = a.ingredients.filter((ingredient) =>
        preferences.availableIngredients.some(
          (available) =>
            ingredient.toLowerCase().includes(available.toLowerCase()) ||
            available.toLowerCase().includes(ingredient.toLowerCase()),
        ),
      ).length

      const bMatches = b.ingredients.filter((ingredient) =>
        preferences.availableIngredients.some(
          (available) =>
            ingredient.toLowerCase().includes(available.toLowerCase()) ||
            available.toLowerCase().includes(ingredient.toLowerCase()),
        ),
      ).length

      return bMatches - aMatches
    })
  }

  const sortedBreakfast = prioritizeMealsWithAvailableIngredients(breakfastMeals)
  const sortedLunch = prioritizeMealsWithAvailableIngredients(lunchMeals)
  const sortedDinner = prioritizeMealsWithAvailableIngredients(dinnerMeals)

  return {
    breakfast: sortedBreakfast[Math.floor(Math.random() * sortedBreakfast.length)] || breakfastMeals[0],
    lunch: sortedLunch[Math.floor(Math.random() * sortedLunch.length)] || lunchMeals[0],
    dinner: sortedDinner[Math.floor(Math.random() * sortedDinner.length)] || dinnerMeals[0],
  }
}

export function findMealsByIngredients(ingredients: string[]): Meal[] {
  return MEAL_DATABASE.filter((meal) => {
    return ingredients.some((ingredient) =>
      meal.ingredients.some(
        (mealIngredient) =>
          mealIngredient.toLowerCase().includes(ingredient.toLowerCase()) ||
          ingredient.toLowerCase().includes(mealIngredient.toLowerCase()),
      ),
    )
  })
}

export function findMealsByCategory(category: "breakfast" | "lunch" | "dinner", preferences: UserPreferences): Meal[] {
  const filteredMeals = filterMealsByPreferences(MEAL_DATABASE, preferences)
  return filteredMeals.filter((meal) => meal.category === category)
}
