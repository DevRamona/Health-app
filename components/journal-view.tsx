"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import type { HealthData } from "@/types/health"
import { PenTool, CalendarIcon, Tag, Search } from "lucide-react"

interface JournalViewProps {
  healthData: HealthData[]
  onDataUpdate: (data: HealthData) => void
}

export function JournalView({ healthData, onDataUpdate }: JournalViewProps) {
  const [newEntry, setNewEntry] = useState("")
  const [newTags, setNewTags] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")

  const journalEntries = healthData.filter((d) => d.type === "journal").reverse()

  const handleSubmit = () => {
    if (!newEntry.trim()) return

    const tags = newTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    const journalData: HealthData = {
      id: Date.now().toString(),
      date: selectedDate,
      type: "journal",
      journalEntry: newEntry,
      tags: tags.length > 0 ? tags : undefined,
    }

    onDataUpdate(journalData)
    setNewEntry("")
    setNewTags("")
    setSelectedDate(new Date())
  }

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch =
      entry.journalEntry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  const allTags = Array.from(new Set(journalEntries.flatMap((entry) => entry.tags || [])))

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/journal-writing.jpg" alt="Journal writing" className="w-full h-full object-cover" />
        </div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <PenTool className="h-6 w-6" />
            <span>Health Journal</span>
          </CardTitle>
          <CardDescription className="text-green-100">
            Reflect on your health journey and track patterns over time
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Entry Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>New Journal Entry</CardTitle>
              <CardDescription>Record your thoughts, feelings, and observations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  placeholder="How are you feeling today? What did you notice about your health, mood, or energy? Any insights or patterns?"
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  rows={6}
                />
              </div>

              <div>
                <Input
                  placeholder="Add tags (comma separated): mood, energy, workout, stress..."
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="text-sm">Date: {selectedDate.toLocaleDateString()}</span>
                </div>
                <Button onClick={handleSubmit} disabled={!newEntry.trim()}>
                  Save Entry
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Journal Entries</CardTitle>
              <CardDescription>{filteredEntries.length} entries found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search entries and tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredEntries.map((entry) => (
                    <div key={entry.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.journalEntry}</p>
                    </div>
                  ))}

                  {filteredEntries.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No entries match your search" : "No journal entries yet"}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Popular Tags */}
          {allTags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="h-4 w-4" />
                  <span>Popular Tags</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => setSearchTerm(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Journal Prompts */}
          <Card>
            <CardHeader>
              <CardTitle>Journal Prompts</CardTitle>
              <CardDescription>Ideas to get you started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => setNewEntry("How did I sleep last night and what might have affected it?")}
                >
                  • How did I sleep last night and what might have affected it?
                </p>
                <p
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => setNewEntry("What gave me energy today?")}
                >
                  • What gave me energy today?
                </p>
                <p
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => setNewEntry("How am I feeling emotionally and why?")}
                >
                  • How am I feeling emotionally and why?
                </p>
                <p
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => setNewEntry("What healthy choices did I make today?")}
                >
                  • What healthy choices did I make today?
                </p>
                <p
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => setNewEntry("What patterns am I noticing in my health data?")}
                >
                  • What patterns am I noticing in my health data?
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
