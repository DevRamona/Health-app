"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { BiohackingTechnique } from "@/types/health"
import { BookOpen, Search, Star, Clock, AlertTriangle } from "lucide-react"

const BIOHACKING_TECHNIQUES: BiohackingTechnique[] = [
  {
    id: "1",
    title: "Cold Exposure Therapy",
    category: "Recovery",
    description:
      "Controlled exposure to cold temperatures to improve circulation, reduce inflammation, and boost mental resilience.",
    difficulty: "intermediate",
    duration: "2-10 minutes",
    benefits: ["Improved circulation", "Reduced inflammation", "Enhanced mood", "Increased alertness"],
    instructions: [
      "Start with cold showers for 30 seconds",
      "Gradually increase duration to 2-3 minutes",
      "Focus on controlled breathing",
      "End with warm water if needed",
    ],
    warnings: ["Consult doctor if you have heart conditions", "Start gradually", "Never force it"],
    relatedMetrics: ["mood", "energy", "stress"],
  },
  {
    id: "2",
    title: "Intermittent Fasting",
    category: "Nutrition",
    description: "Cycling between periods of eating and fasting to improve metabolic health and cognitive function.",
    difficulty: "beginner",
    duration: "12-16 hours",
    benefits: ["Weight management", "Improved insulin sensitivity", "Enhanced focus", "Cellular repair"],
    instructions: [
      "Start with 12-hour fasting window",
      "Gradually extend to 14-16 hours",
      "Stay hydrated during fasting",
      "Break fast with nutritious foods",
    ],
    warnings: ["Not suitable for everyone", "Consult healthcare provider", "Listen to your body"],
    relatedMetrics: ["energy", "focus", "weight"],
  },
  {
    id: "3",
    title: "Box Breathing",
    category: "Mental",
    description: "Structured breathing technique to reduce stress, improve focus, and regulate the nervous system.",
    difficulty: "beginner",
    duration: "5-10 minutes",
    benefits: ["Reduced stress", "Improved focus", "Better sleep", "Emotional regulation"],
    instructions: [
      "Inhale for 4 counts",
      "Hold breath for 4 counts",
      "Exhale for 4 counts",
      "Hold empty for 4 counts",
      "Repeat for 5-10 cycles",
    ],
    relatedMetrics: ["stress", "focus", "mood"],
  },
  {
    id: "4",
    title: "Red Light Therapy",
    category: "Recovery",
    description: "Exposure to specific wavelengths of red light to promote cellular healing and energy production.",
    difficulty: "beginner",
    duration: "10-20 minutes",
    benefits: ["Improved skin health", "Faster muscle recovery", "Better sleep", "Reduced inflammation"],
    instructions: [
      "Use red light device 6-12 inches from skin",
      "Expose target area for 10-20 minutes",
      "Use consistently for best results",
      "Protect eyes from direct exposure",
    ],
    warnings: ["Avoid looking directly at light", "Start with shorter sessions"],
    relatedMetrics: ["sleep", "energy", "recovery"],
  },
  {
    id: "5",
    title: "Grounding/Earthing",
    category: "Wellness",
    description: "Direct physical contact with the earth's surface to reduce inflammation and improve sleep.",
    difficulty: "beginner",
    duration: "20-30 minutes",
    benefits: ["Reduced inflammation", "Better sleep", "Stress reduction", "Improved circulation"],
    instructions: [
      "Walk barefoot on grass, sand, or soil",
      "Sit or lie directly on the ground",
      "Use grounding mats indoors",
      "Practice regularly for best results",
    ],
    relatedMetrics: ["sleep", "stress", "mood"],
  },
  {
    id: "6",
    title: "Nootropic Stack",
    category: "Cognitive",
    description: "Combination of supplements designed to enhance cognitive function, focus, and mental clarity.",
    difficulty: "advanced",
    duration: "Daily",
    benefits: ["Enhanced focus", "Improved memory", "Better mood", "Increased motivation"],
    instructions: [
      "Research individual compounds thoroughly",
      "Start with single ingredients",
      "Monitor effects carefully",
      "Cycle usage to prevent tolerance",
    ],
    warnings: ["Consult healthcare provider", "Start with low doses", "Be aware of interactions"],
    relatedMetrics: ["focus", "mood", "energy"],
  },
]

export function BiohackingLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [bookmarked, setBookmarked] = useState<string[]>([])

  const categories = ["all", ...Array.from(new Set(BIOHACKING_TECHNIQUES.map((t) => t.category)))]

  const filteredTechniques = BIOHACKING_TECHNIQUES.filter((technique) => {
    const matchesSearch =
      technique.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technique.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || technique.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "intermediate":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "advanced":
        return "bg-rose-100 text-rose-800 border-rose-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/biohacking-lab.jpg" alt="Biohacking laboratory" className="w-full h-full object-cover" />
        </div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <BookOpen className="h-6 w-6" />
            <span>Biohacking Library</span>
          </CardTitle>
          <CardDescription className="text-purple-100">
            Discover evidence-based techniques to optimize your health and performance
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search techniques..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="capitalize">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechniques.map((technique) => (
          <Card key={technique.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{technique.title}</CardTitle>
                  <CardDescription className="mt-1">{technique.description}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleBookmark(technique.id)}
                  className={bookmarked.includes(technique.id) ? "text-yellow-500" : "text-gray-400"}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getDifficultyColor(technique.difficulty)}>{technique.difficulty}</Badge>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{technique.duration}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Benefits:</h4>
                <div className="flex flex-wrap gap-1">
                  {technique.benefits.slice(0, 3).map((benefit) => (
                    <Badge key={benefit} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                  {technique.benefits.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{technique.benefits.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Quick Start:</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  {technique.instructions.slice(0, 2).map((instruction, index) => (
                    <li key={index} className="flex space-x-2">
                      <span className="font-medium">{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {technique.warnings && (
                <div className="flex items-start space-x-2 p-2 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-800">{technique.warnings[0]}</p>
                </div>
              )}

              <Button variant="outline" className="w-full bg-transparent">
                View Full Guide
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {bookmarked.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bookmarked Techniques</CardTitle>
            <CardDescription>Your saved biohacking techniques</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {bookmarked.map((id) => {
                const technique = BIOHACKING_TECHNIQUES.find((t) => t.id === id)
                return technique ? (
                  <Badge key={id} variant="secondary" className="flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>{technique.title}</span>
                  </Badge>
                ) : null
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
