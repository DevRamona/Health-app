export interface UserProfile {
  id: string
  name: string
  age: number
  weight: number
  height: number
  fitnessGoal: string
  medicalConditions: string[]
  createdAt: Date
}

export interface HealthData {
  id: string
  date: Date
  type: "sleep" | "workout" | "meal" | "mood" | "supplement" | "biometric" | "journal"

  // Sleep data
  sleepDuration?: number
  sleepQuality?: number
  bedTime?: string
  wakeTime?: string

  // Workout data
  workoutType?: string
  workoutDuration?: number
  workoutIntensity?: number
  caloriesBurned?: number

  // Meal data
  mealType?: "breakfast" | "lunch" | "dinner" | "snack"
  foods?: string[]
  calories?: number
  moodAfterEating?: number

  // Mood & Mental data
  mood?: number
  stress?: number
  focus?: number
  anxiety?: number
  energy?: number

  // Supplement data
  supplements?: string[]
  dosage?: string

  // Biometric data
  weight?: number
  heartRate?: number
  bloodPressure?: string
  steps?: number
  waterIntake?: number
  screenTime?: number

  // Journal data
  journalEntry?: string
  tags?: string[]

  // Experiment data
  experimentId?: string

  notes?: string
}

export interface Experiment {
  id: string
  title: string
  hypothesis: string
  duration: number
  startDate: Date
  endDate?: Date
  status: "active" | "completed" | "paused"
  metrics: string[]
  baselineData?: HealthData[]
  results?: ExperimentResult
}

export interface ExperimentResult {
  summary: string
  beforeAverage: number
  afterAverage: number
  improvement: number
  insights: string[]
}

export interface BiohackingTechnique {
  id: string
  title: string
  category: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  benefits: string[]
  instructions: string[]
  warnings?: string[]
  relatedMetrics: string[]
}

export interface Recommendation {
  id: string
  type: "insight" | "suggestion" | "warning"
  title: string
  description: string
  confidence: number
  basedOn: string[]
  actionable: boolean
}
