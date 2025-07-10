"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { WeeklyMealPlan } from "@/types/meal-planner"
import { generateGroceryList } from "@/lib/grocery-generator"
import { ShoppingCart, Download, Check } from "lucide-react"
import { useState } from "react"

function getCategoryIcon(category: string): string {
  const categoryIcons: { [key: string]: string } = {
    Produce: "🥬",
    "Meat & Seafood": "🥩",
    "Dairy & Eggs": "🥛",
    "Pantry & Dry Goods": "🌾",
    "Condiments & Sauces": "🍯",
    "Herbs & Spices": "🌿",
    Other: "🛒",
  }

  return categoryIcons[category] || "📦"
}

interface GroceryListProps {
  weeklyMealPlan: WeeklyMealPlan | null
}

export function GroceryList({ weeklyMealPlan }: GroceryListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  if (!weeklyMealPlan) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Generate a meal plan first to see your grocery list</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const groceryList = generateGroceryList(weeklyMealPlan)

  const handleItemCheck = (item: string) => {
    const newCheckedItems = new Set(checkedItems)
    if (newCheckedItems.has(item)) {
      newCheckedItems.delete(item)
    } else {
      newCheckedItems.add(item)
    }
    setCheckedItems(newCheckedItems)
  }

  const exportGroceryList = () => {
    const listText = Object.entries(groceryList)
      .map(([category, items]) => {
        return `${category.toUpperCase()}\n${items.map((item) => `- ${item}`).join("\n")}\n`
      })
      .join("\n")

    const blob = new Blob([listText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "grocery-list.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const totalItems = Object.values(groceryList).flat().length
  const checkedCount = checkedItems.size

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grocery List</h2>
          <p className="text-gray-600">
            Based on your weekly meal plan • {checkedCount}/{totalItems} items checked
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportGroceryList}>
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          {checkedCount === totalItems && totalItems > 0 && (
            <Badge className="bg-green-500 text-white px-3 py-1">
              <Check className="h-4 w-4 mr-1" />
              Complete!
            </Badge>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groceryList).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg capitalize flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <span className="text-2xl">{getCategoryIcon(category)}</span>
                  <span>{category}</span>
                </span>
                <Badge variant="secondary">
                  {items.filter((item) => checkedItems.has(item)).length}/{items.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                {items.length} item{items.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={checkedItems.has(item)}
                      onCheckedChange={() => handleItemCheck(item)}
                    />
                    <label
                      htmlFor={item}
                      className={`text-sm cursor-pointer flex-1 ${
                        checkedItems.has(item) ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalItems === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No grocery items found</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
