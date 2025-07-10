"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { HealthData, Experiment } from "@/types/health"
import { FlaskConical, Play, Pause, CheckCircle, Clock } from "lucide-react"

interface ExperimentsLabProps {
  healthData: HealthData[]
  onDataUpdate: (data: HealthData) => void
}

const EXPERIMENT_TEMPLATES = [
  {
    title: "Caffeine Cutoff Experiment",
    hypothesis: "Cutting caffeine after 2pm will improve sleep quality",
    duration: 14,
    metrics: ["sleepQuality", "sleepDuration"],
  },
  {
    title: "Morning Exercise Impact",
    hypothesis: "Exercising in the morning will increase energy levels throughout the day",
    duration: 10,
    metrics: ["energy", "mood"],
  },
  {
    title: "Screen Time Reduction",
    hypothesis: "Reducing screen time before bed will improve sleep and focus",
    duration: 7,
    metrics: ["sleepQuality", "focus"],
  },
  {
    title: "Meditation Practice",
    hypothesis: "Daily 10-minute meditation will reduce stress and improve mood",
    duration: 21,
    metrics: ["stress", "mood", "focus"],
  },
]

export function ExperimentsLab({ healthData, onDataUpdate }: ExperimentsLabProps) {
  const [activeExperiments, setActiveExperiments] = useState<Experiment[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newExperiment, setNewExperiment] = useState({
    title: "",
    hypothesis: "",
    duration: 7,
    metrics: [] as string[],
  })

  const useTemplate = (template: (typeof EXPERIMENT_TEMPLATES)[0]) => {
    setNewExperiment({
      title: template.title,
      hypothesis: template.hypothesis,
      duration: template.duration,
      metrics: template.metrics,
    })
    setShowCreateForm(true)
  }

  const createExperiment = () => {
    if (!newExperiment.title || !newExperiment.hypothesis) return

    const experiment: Experiment = {
      id: Date.now().toString(),
      title: newExperiment.title,
      hypothesis: newExperiment.hypothesis,
      duration: newExperiment.duration,
      startDate: new Date(),
      status: "active",
      metrics: newExperiment.metrics,
    }

    setActiveExperiments((prev) => [...prev, experiment])
    setNewExperiment({ title: "", hypothesis: "", duration: 7, metrics: [] })
    setShowCreateForm(false)
  }

  const getExperimentProgress = (experiment: Experiment) => {
    const daysPassed = Math.floor((Date.now() - experiment.startDate.getTime()) / (1000 * 60 * 60 * 24))
    return Math.min((daysPassed / experiment.duration) * 100, 100)
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/science-lab.jpg" alt="Science laboratory" className="w-full h-full object-cover" />
        </div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <FlaskConical className="h-6 w-6" />
            <span>Health Experiments Lab</span>
          </CardTitle>
          <CardDescription className="text-cyan-100">
            Design and track personal health experiments to optimize your well-being
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Active Experiments */}
      {activeExperiments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Experiments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeExperiments.map((experiment) => (
              <Card key={experiment.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{experiment.title}</CardTitle>
                    <Badge variant={experiment.status === "active" ? "default" : "secondary"}>
                      {experiment.status}
                    </Badge>
                  </div>
                  <CardDescription>{experiment.hypothesis}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{Math.floor(getExperimentProgress(experiment))}%</span>
                      </div>
                      <Progress value={getExperimentProgress(experiment)} />
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{experiment.duration} days</span>
                      </div>
                      <div>Tracking: {experiment.metrics.join(", ")}</div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Experiment Templates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Experiment Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXPERIMENT_TEMPLATES.map((template, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{template.title}</CardTitle>
                <CardDescription>{template.hypothesis}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {template.duration} days • {template.metrics.length} metrics
                  </div>
                  <Button
                    size="sm"
                    onClick={() =>
                      setActiveExperiments((prev) => [
                        ...prev,
                        {
                          id: Date.now().toString(),
                          title: template.title,
                          hypothesis: template.hypothesis,
                          duration: template.duration,
                          startDate: new Date(),
                          status: "active",
                          metrics: template.metrics,
                        },
                      ])
                    }
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Custom Experiment */}
      <Card>
        <CardHeader>
          <CardTitle>Create Custom Experiment</CardTitle>
          <CardDescription>Design your own health optimization experiment</CardDescription>
        </CardHeader>
        <CardContent>
          {!showCreateForm ? (
            <Button onClick={() => setShowCreateForm(true)}>
              <FlaskConical className="h-4 w-4 mr-2" />
              Create New Experiment
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Experiment Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Cold Shower Challenge"
                  value={newExperiment.title}
                  onChange={(e) => setNewExperiment((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="hypothesis">Hypothesis</Label>
                <Textarea
                  id="hypothesis"
                  placeholder="e.g., Taking cold showers will increase energy and improve mood"
                  value={newExperiment.hypothesis}
                  onChange={(e) => setNewExperiment((prev) => ({ ...prev, hypothesis: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Select
                    onValueChange={(value) =>
                      setNewExperiment((prev) => ({ ...prev, duration: Number.parseInt(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="21">21 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Metrics to Track</Label>
                  <Select
                    onValueChange={(value) => {
                      if (!newExperiment.metrics.includes(value)) {
                        setNewExperiment((prev) => ({ ...prev, metrics: [...prev.metrics, value] }))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add metrics" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mood">Mood</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="sleep">Sleep Quality</SelectItem>
                      <SelectItem value="focus">Focus</SelectItem>
                      <SelectItem value="stress">Stress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newExperiment.metrics.length > 0 && (
                <div>
                  <Label>Selected Metrics:</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {newExperiment.metrics.map((metric) => (
                      <Badge key={metric} variant="secondary">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={createExperiment} disabled={!newExperiment.title || !newExperiment.hypothesis}>
                  Create Experiment
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
