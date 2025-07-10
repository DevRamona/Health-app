import type { UserPreferences, WeeklyMealPlan, ChatResponse } from "@/types/meal-planner"
import { findMealsByIngredients, findMealsByCategory, generateWeeklyMealPlan } from "./meal-generator"
import { MEAL_DATABASE } from "./meal-database"

export async function processChatMessage(
  message: string,
  preferences: UserPreferences,
  currentMealPlan: WeeklyMealPlan | null,
): Promise<ChatResponse> {
  const lowerMessage = message.toLowerCase()

  // Handle ingredient-based queries
  if (lowerMessage.includes("i have") || lowerMessage.includes("using")) {
    return handleIngredientQuery(message, preferences)
  }

  // Handle meal suggestions
  if (lowerMessage.includes("suggest") || lowerMessage.includes("recommend")) {
    return handleMealSuggestion(message, preferences)
  }

  // Handle meal planning
  if (lowerMessage.includes("plan") && (lowerMessage.includes("week") || lowerMessage.includes("meal"))) {
    return handleMealPlanning(preferences)
  }

  // Handle recipe requests
  if (lowerMessage.includes("recipe") || lowerMessage.includes("how to make")) {
    return handleRecipeRequest(message, preferences)
  }

  // Handle general questions
  if (lowerMessage.includes("what can i make") || lowerMessage.includes("what to cook")) {
    return handleGeneralCookingQuery(message, preferences)
  }

  // Default response
  return {
    message:
      "I can help you with meal planning, recipe suggestions, and cooking ideas! Try asking me about:\n\n• Ingredients you have at home\n• Meal suggestions for breakfast, lunch, or dinner\n• Weekly meal planning\n• Recipe ideas\n\nWhat would you like to know?",
    suggestions: [
      "I have chicken and vegetables",
      "Suggest a healthy dinner",
      "Plan my meals for this week",
      "What's a quick breakfast idea?",
    ],
  }
}

function handleIngredientQuery(message: string, preferences: UserPreferences): ChatResponse {
  // Extract ingredients from the message
  const ingredients = extractIngredients(message)

  if (ingredients.length === 0) {
    return {
      message:
        "I didn't catch which ingredients you have. Could you tell me more specifically? For example: 'I have eggs, tomatoes, and cheese'",
      suggestions: ["I have eggs and tomatoes", "I have chicken and rice", "I have pasta and vegetables"],
    }
  }

  const matchingMeals = findMealsByIngredients(ingredients)

  if (matchingMeals.length === 0) {
    return {
      message: `I couldn't find specific recipes using ${ingredients.join(", ")}, but here are some general cooking ideas:\n\n• Try making a stir-fry with your ingredients\n• Consider a simple pasta dish\n• Make a salad or wrap\n\nWould you like me to suggest some specific recipes instead?`,
      suggestions: ["Suggest a quick dinner", "What's a healthy lunch idea?", "Show me breakfast options"],
    }
  }

  const topMeals = matchingMeals.slice(0, 3)
  const mealList = topMeals
    .map((meal) => `• **${meal.name}** - ${meal.description} (${meal.prepTime} min, ${meal.calories} cal)`)
    .join("\n")

  return {
    message: `Great! Here are some recipes you can make with ${ingredients.join(", ")}:\n\n${mealList}\n\nWould you like the full recipe for any of these?`,
    suggestions: topMeals.map((meal) => `Recipe for ${meal.name}`),
  }
}

function handleMealSuggestion(message: string, preferences: UserPreferences): ChatResponse {
  const lowerMessage = message.toLowerCase()
  let category: "breakfast" | "lunch" | "dinner" | null = null

  if (lowerMessage.includes("breakfast")) category = "breakfast"
  else if (lowerMessage.includes("lunch")) category = "lunch"
  else if (lowerMessage.includes("dinner")) category = "dinner"

  if (category) {
    const meals = findMealsByCategory(category, preferences)
    const randomMeals = meals.sort(() => 0.5 - Math.random()).slice(0, 3)

    const mealList = randomMeals
      .map((meal) => `• **${meal.name}** - ${meal.description} (${meal.prepTime} min, ${meal.calories} cal)`)
      .join("\n")

    return {
      message: `Here are some ${category} suggestions for you:\n\n${mealList}\n\nWould you like the recipe for any of these?`,
      suggestions: randomMeals.map((meal) => `Recipe for ${meal.name}`),
    }
  }

  // General meal suggestion
  const allMeals = MEAL_DATABASE.filter((meal) => {
    // Filter by preferences
    if (preferences.allergies.some((allergy) => meal.allergens.includes(allergy))) {
      return false
    }
    return true
  })

  const randomMeals = allMeals.sort(() => 0.5 - Math.random()).slice(0, 3)

  const mealList = randomMeals
    .map((meal) => `• **${meal.name}** - ${meal.description} (${meal.prepTime} min, ${meal.calories} cal)`)
    .join("\n")

  return {
    message: `Here are some meal suggestions for you:\n\n${mealList}\n\nWould you like the full recipe for any of these?`,
    suggestions: randomMeals.map((meal) => `Recipe for ${meal.name}`),
  }
}

function handleMealPlanning(preferences: UserPreferences): ChatResponse {
  const newMealPlan = generateWeeklyMealPlan(preferences)

  return {
    message:
      "I've generated a new weekly meal plan for you based on your preferences! Check out the 'Meal Planner' tab to see your personalized meals for each day of the week.\n\nYour plan includes:\n• 21 meals (3 per day for 7 days)\n• Meals that match your dietary preferences\n• Recipes that avoid your allergens\n• Priority given to meals using your available ingredients",
    updatedMealPlan: newMealPlan,
    suggestions: [
      "Show me today's meals",
      "Generate grocery list",
      "Suggest a different dinner",
      "I want to change a meal",
    ],
  }
}

function handleRecipeRequest(message: string, preferences: UserPreferences): ChatResponse {
  // Try to extract meal name from the message
  const mealName = extractMealName(message)

  if (mealName) {
    const meal = MEAL_DATABASE.find(
      (m) =>
        m.name.toLowerCase().includes(mealName.toLowerCase()) || mealName.toLowerCase().includes(m.name.toLowerCase()),
    )

    if (meal) {
      const ingredientsList = meal.ingredients.map((ing) => `• ${ing}`).join("\n")
      const instructionsList = meal.instructions.map((inst, idx) => `${idx + 1}. ${inst}`).join("\n")

      return {
        message: `Here's the recipe for **${meal.name}**:\n\n**Ingredients:**\n${ingredientsList}\n\n**Instructions:**\n${instructionsList}\n\n**Prep Time:** ${meal.prepTime} minutes | **Servings:** ${meal.servings} | **Calories:** ${meal.calories}`,
        suggestions: ["Find similar recipes", "Add to meal plan", "Show me another recipe"],
      }
    }
  }

  return {
    message:
      "I'd be happy to share a recipe! Could you be more specific about which dish you'd like the recipe for? You can ask for recipes from your meal plan or mention a specific dish name.",
    suggestions: ["Recipe for Avocado Toast", "Recipe for Chicken Stir Fry", "Recipe for Lentil Curry"],
  }
}

function handleGeneralCookingQuery(message: string, preferences: UserPreferences): ChatResponse {
  const availableIngredients = preferences.availableIngredients

  if (availableIngredients.length > 0) {
    const matchingMeals = findMealsByIngredients(availableIngredients)
    const topMeals = matchingMeals.slice(0, 3)

    if (topMeals.length > 0) {
      const mealList = topMeals.map((meal) => `• **${meal.name}** - ${meal.description}`).join("\n")

      return {
        message: `Based on your available ingredients (${availableIngredients.join(", ")}), here's what you can make:\n\n${mealList}\n\nWould you like the full recipe for any of these?`,
        suggestions: topMeals.map((meal) => `Recipe for ${meal.name}`),
      }
    }
  }

  // General cooking suggestions based on preferences
  const filteredMeals = MEAL_DATABASE.filter((meal) => {
    if (preferences.allergies.some((allergy) => meal.allergens.includes(allergy))) {
      return false
    }
    return true
  })

  const randomMeals = filteredMeals.sort(() => 0.5 - Math.random()).slice(0, 4)
  const mealList = randomMeals.map((meal) => `• **${meal.name}** (${meal.category}) - ${meal.prepTime} min`).join("\n")

  return {
    message: `Here are some cooking ideas that match your preferences:\n\n${mealList}\n\nWould you like a specific recipe or more suggestions for a particular meal type?`,
    suggestions: [
      "Quick breakfast ideas",
      "Healthy lunch options",
      "Easy dinner recipes",
      "Recipe for " + randomMeals[0]?.name,
    ],
  }
}

function extractIngredients(message: string): string[] {
  const commonIngredients = [
    "eggs",
    "chicken",
    "beef",
    "pork",
    "fish",
    "salmon",
    "tuna",
    "tomatoes",
    "onions",
    "garlic",
    "potatoes",
    "carrots",
    "broccoli",
    "spinach",
    "lettuce",
    "avocado",
    "cheese",
    "milk",
    "butter",
    "rice",
    "pasta",
    "bread",
    "flour",
    "beans",
    "lentils",
    "mushrooms",
    "peppers",
    "cucumber",
    "zucchini",
    "corn",
  ]

  const foundIngredients: string[] = []
  const lowerMessage = message.toLowerCase()

  commonIngredients.forEach((ingredient) => {
    if (lowerMessage.includes(ingredient)) {
      foundIngredients.push(ingredient)
    }
  })

  return foundIngredients
}

function extractMealName(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Look for "recipe for [meal name]" pattern
  const recipeForMatch = lowerMessage.match(/recipe for (.+)/)
  if (recipeForMatch) {
    return recipeForMatch[1].trim()
  }

  // Look for "how to make [meal name]" pattern
  const howToMakeMatch = lowerMessage.match(/how to make (.+)/)
  if (howToMakeMatch) {
    return howToMakeMatch[1].trim()
  }

  return ""
}
