import type { WeeklyMealPlan, GroceryList } from "@/types/meal-planner"

export function generateGroceryList(weeklyMealPlan: WeeklyMealPlan): GroceryList {
  const allIngredients: string[] = []

  // Collect all ingredients from all meals
  Object.values(weeklyMealPlan.days).forEach((day) => {
    allIngredients.push(...day.breakfast.ingredients)
    allIngredients.push(...day.lunch.ingredients)
    allIngredients.push(...day.dinner.ingredients)
  })

  // Remove duplicates and categorize
  const uniqueIngredients = [...new Set(allIngredients)]

  return categorizeIngredients(uniqueIngredients)
}

function categorizeIngredients(ingredients: string[]): GroceryList {
  const categories: GroceryList = {
    Produce: [],
    "Meat & Seafood": [],
    "Dairy & Eggs": [],
    "Pantry & Dry Goods": [],
    "Condiments & Sauces": [],
    "Herbs & Spices": [],
    Other: [],
  }

  ingredients.forEach((ingredient) => {
    const lowerIngredient = ingredient.toLowerCase()

    // Produce
    if (isProduceItem(lowerIngredient)) {
      categories["Produce"].push(ingredient)
    }
    // Meat & Seafood
    else if (isMeatOrSeafood(lowerIngredient)) {
      categories["Meat & Seafood"].push(ingredient)
    }
    // Dairy & Eggs
    else if (isDairyOrEggs(lowerIngredient)) {
      categories["Dairy & Eggs"].push(ingredient)
    }
    // Condiments & Sauces
    else if (isCondimentOrSauce(lowerIngredient)) {
      categories["Condiments & Sauces"].push(ingredient)
    }
    // Herbs & Spices
    else if (isHerbOrSpice(lowerIngredient)) {
      categories["Herbs & Spices"].push(ingredient)
    }
    // Pantry & Dry Goods
    else if (isPantryItem(lowerIngredient)) {
      categories["Pantry & Dry Goods"].push(ingredient)
    }
    // Other
    else {
      categories["Other"].push(ingredient)
    }
  })

  // Remove empty categories
  Object.keys(categories).forEach((category) => {
    if (categories[category].length === 0) {
      delete categories[category]
    }
  })

  return categories
}

function isProduceItem(ingredient: string): boolean {
  const produceItems = [
    "tomato",
    "onion",
    "garlic",
    "potato",
    "carrot",
    "broccoli",
    "spinach",
    "lettuce",
    "avocado",
    "cucumber",
    "pepper",
    "mushroom",
    "zucchini",
    "corn",
    "berries",
    "banana",
    "lemon",
    "lime",
    "apple",
    "orange",
    "herbs",
    "cilantro",
    "parsley",
    "basil",
    "mint",
    "ginger",
    "celery",
    "cabbage",
    "kale",
  ]

  return produceItems.some((item) => ingredient.includes(item))
}

function isMeatOrSeafood(ingredient: string): boolean {
  const meatSeafoodItems = [
    "chicken",
    "beef",
    "pork",
    "turkey",
    "salmon",
    "fish",
    "tuna",
    "shrimp",
    "crab",
    "lobster",
    "bacon",
    "ham",
  ]

  return meatSeafoodItems.some((item) => ingredient.includes(item))
}

function isDairyOrEggs(ingredient: string): boolean {
  const dairyEggItems = [
    "milk",
    "cheese",
    "butter",
    "cream",
    "yogurt",
    "egg",
    "feta",
    "parmesan",
    "mozzarella",
    "cheddar",
  ]

  return dairyEggItems.some((item) => ingredient.includes(item))
}

function isCondimentOrSauce(ingredient: string): boolean {
  const condimentSauceItems = [
    "oil",
    "vinegar",
    "soy sauce",
    "mayo",
    "mustard",
    "ketchup",
    "hot sauce",
    "dressing",
    "sauce",
    "paste",
  ]

  return condimentSauceItems.some((item) => ingredient.includes(item))
}

function isHerbOrSpice(ingredient: string): boolean {
  const herbSpiceItems = [
    "salt",
    "pepper",
    "paprika",
    "cumin",
    "oregano",
    "thyme",
    "rosemary",
    "sage",
    "curry",
    "turmeric",
    "cinnamon",
    "nutmeg",
  ]

  return herbSpiceItems.some((item) => ingredient.includes(item))
}

function isPantryItem(ingredient: string): boolean {
  const pantryItems = [
    "rice",
    "pasta",
    "bread",
    "flour",
    "sugar",
    "honey",
    "oats",
    "quinoa",
    "beans",
    "lentils",
    "nuts",
    "seeds",
    "broth",
    "stock",
    "coconut milk",
    "canned",
    "dried",
  ]

  return pantryItems.some((item) => ingredient.includes(item))
}
