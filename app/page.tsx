"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthProvider } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserMenu } from "@/components/user-menu"
import { UserProfileSetup } from "@/components/user-profile-setup"
import { MainDashboard } from "@/components/main-dashboard"
import { DataInputHub } from "@/components/data-input-hub"
import { AnalyticsView } from "@/components/analytics-view"
import { ExperimentsLab } from "@/components/experiments-lab"
import { BiohackingLibrary } from "@/components/biohacking-library"
import { JournalView } from "@/components/journal-view"
import type { UserProfile, HealthData } from "@/types/health"
import { Activity, Brain, FlaskConical, BookOpen, PenTool, BarChart3, Plus } from "lucide-react"

function HealthDashboardContent() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [healthData, setHealthData] = useState<HealthData[]>([])
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    // Load user profile and health data from localStorage
    const savedProfile = localStorage.getItem("healthProfile")
    const savedData = localStorage.getItem("healthData")

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }

    if (savedData) {
      setHealthData(JSON.parse(savedData))
    }
  }, [])

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile)
    localStorage.setItem("healthProfile", JSON.stringify(profile))
  }

  const handleDataUpdate = (newData: HealthData) => {
    const updatedData = [...healthData, newData]
    setHealthData(updatedData)
    localStorage.setItem("healthData", JSON.stringify(updatedData))
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Activity className="h-12 w-12 text-emerald-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Health Optimization Dashboard
              </h1>
            </div>
            <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/health-hero.jpg"
                alt="Health and wellness lifestyle"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-teal-600/80 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-3xl font-bold mb-2">Transform Your Health Journey</h2>
                  <p className="text-xl opacity-90">Data-driven insights for optimal wellness</p>
                </div>
              </div>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Transform your health data into actionable insights. Track, analyze, and optimize your physical and mental
              performance with AI-powered recommendations.
            </p>
          </div>
          <UserProfileSetup onComplete={handleProfileComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-emerald-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Health Dashboard
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {userProfile.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Goal: {userProfile.fitnessGoal}</p>
              <p className="text-xs text-gray-500">{healthData.length} data points logged</p>
            </div>
            <UserMenu />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="input" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Log Data</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="experiments" className="flex items-center space-x-2">
              <FlaskConical className="h-4 w-4" />
              <span className="hidden sm:inline">Experiments</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Library</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center space-x-2">
              <PenTool className="h-4 w-4" />
              <span className="hidden sm:inline">Journal</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <MainDashboard userProfile={userProfile} healthData={healthData} />
          </TabsContent>

          <TabsContent value="input">
            <DataInputHub onDataUpdate={handleDataUpdate} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsView healthData={healthData} userProfile={userProfile} />
          </TabsContent>

          <TabsContent value="experiments">
            <ExperimentsLab healthData={healthData} onDataUpdate={handleDataUpdate} />
          </TabsContent>

          <TabsContent value="library">
            <BiohackingLibrary />
          </TabsContent>

          <TabsContent value="journal">
            <JournalView healthData={healthData} onDataUpdate={handleDataUpdate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function HealthDashboard() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <HealthDashboardContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}
