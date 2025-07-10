export interface UserProfile {
  id: string
  name: string
  age: number
  gender: "male" | "female" | "other"
  height: number // in cm
  weight: number // in kg
  activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active"
  fitnessGoal:
    | "lose_weight"
    | "gain_weight"
    | "maintain_weight"
    | "build_muscle"
    | "improve_endurance"
    | "general_health"
  healthConditions: string[]
  medications: string[]
  sleepGoal: number // hours
  preferences: {
    units: "metric" | "imperial"
    notifications: boolean
    dataSharing: boolean
  }
}

export interface HealthData {
  id: string
  date: Date
  type: "sleep" | "workout" | "meal" | "mood" | "biometric" | "supplement"

  // Sleep data
  sleepDuration?: number // hours
  sleepQuality?: number // 1-10 scale
  bedTime?: string
  wakeTime?: string

  // Workout data
  workoutType?: string
  workoutDuration?: number // minutes
  workoutIntensity?: number // 1-10 scale
  caloriesBurned?: number

  // Mood data
  mood?: number // 1-10 scale
  stress?: number // 1-10 scale
  energy?: number // 1-10 scale
  focus?: number // 1-10 scale
  anxiety?: number // 1-10 scale

  // Biometric data
  weight?: number
  bodyFat?: number
  heartRate?: number
  bloodPressure?: { systolic: number; diastolic: number }
  steps?: number
  waterIntake?: number // oz
  screenTime?: number // hours

  // Meal data
  mealType?: "breakfast" | "lunch" | "dinner" | "snack"
  calories?: number
  protein?: number
  carbs?: number
  fat?: number

  // General
  notes?: string
  tags?: string[]
  location?: string
  weather?: string
}

export interface Recommendation {
  id: string
  type: "insight" | "suggestion" | "warning"
  title: string
  description: string
  confidence: number // 0-100
  basedOn: string[]
  actionable: boolean
  priority: "low" | "medium" | "high"
}

export interface Experiment {
  id: string
  name: string
  description: string
  hypothesis: string
  startDate: Date
  endDate?: Date
  status: "planning" | "active" | "completed" | "paused"
  variables: {
    independent: string[]
    dependent: string[]
  }
  protocol: string[]
  results?: {
    summary: string
    data: HealthData[]
    conclusion: string
  }
}
