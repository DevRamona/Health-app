import type { HealthData, UserProfile, Recommendation } from "@/types/health"

export function generateRecommendations(healthData: HealthData[], userProfile: UserProfile): Recommendation[] {
  const recommendations: Recommendation[] = []

  // Sleep analysis
  const sleepData = healthData.filter((d) => d.sleepDuration).slice(-14)
  if (sleepData.length > 0) {
    const avgSleep = sleepData.reduce((sum, d) => sum + (d.sleepDuration || 0), 0) / sleepData.length
    const avgQuality = sleepData.reduce((sum, d) => sum + (d.sleepQuality || 0), 0) / sleepData.length

    if (avgSleep < 7) {
      recommendations.push({
        id: "sleep-duration",
        type: "warning",
        title: "Insufficient Sleep Duration",
        description: `Your average sleep is ${avgSleep.toFixed(1)} hours. Aim for 7-9 hours for optimal health.`,
        confidence: 85,
        actionable: true,
        basedOn: ["sleep duration", "sleep quality"],
      })
    }

    if (avgQuality < 6) {
      recommendations.push({
        id: "sleep-quality",
        type: "suggestion",
        title: "Improve Sleep Quality",
        description: "Consider establishing a bedtime routine and optimizing your sleep environment.",
        confidence: 78,
        actionable: true,
        basedOn: ["sleep quality scores"],
      })
    }
  }

  // Mood and energy correlation
  const moodData = healthData.filter((d) => d.mood && d.energy).slice(-7)
  if (moodData.length > 0) {
    const avgMood = moodData.reduce((sum, d) => sum + (d.mood || 0), 0) / moodData.length
    const avgEnergy = moodData.reduce((sum, d) => sum + (d.energy || 0), 0) / moodData.length

    if (avgMood < 6 || avgEnergy < 6) {
      recommendations.push({
        id: "mood-energy",
        type: "insight",
        title: "Mood and Energy Optimization",
        description:
          "Your mood and energy levels could benefit from regular exercise and stress management techniques.",
        confidence: 72,
        actionable: true,
        basedOn: ["mood scores", "energy levels"],
      })
    }
  }

  // Workout consistency
  const workoutData = healthData.filter((d) => d.type === "workout").slice(-14)
  const workoutsPerWeek = workoutData.length / 2

  if (workoutsPerWeek < 3) {
    recommendations.push({
      id: "workout-frequency",
      type: "suggestion",
      title: "Increase Exercise Frequency",
      description: `You're averaging ${workoutsPerWeek.toFixed(1)} workouts per week. Aim for 3-5 sessions for optimal health benefits.`,
      confidence: 80,
      actionable: true,
      basedOn: ["workout frequency"],
    })
  }

  // Hydration analysis
  const hydrationData = healthData.filter((d) => d.waterIntake).slice(-7)
  if (hydrationData.length > 0) {
    const avgWater = hydrationData.reduce((sum, d) => sum + (d.waterIntake || 0), 0) / hydrationData.length

    if (avgWater < 64) {
      recommendations.push({
        id: "hydration",
        type: "suggestion",
        title: "Increase Water Intake",
        description: `You're averaging ${avgWater.toFixed(0)}oz of water daily. Aim for at least 64oz for proper hydration.`,
        confidence: 75,
        actionable: true,
        basedOn: ["water intake logs"],
      })
    }
  }

  // Screen time and focus correlation
  const screenData = healthData.filter((d) => d.screenTime && d.focus).slice(-7)
  if (screenData.length > 0) {
    const highScreenDays = screenData.filter((d) => (d.screenTime || 0) > 8)
    const avgFocusHighScreen = highScreenDays.reduce((sum, d) => sum + (d.focus || 0), 0) / highScreenDays.length

    if (highScreenDays.length > 0 && avgFocusHighScreen < 6) {
      recommendations.push({
        id: "screen-focus",
        type: "insight",
        title: "Screen Time Impact on Focus",
        description: "High screen time days correlate with lower focus scores. Consider digital wellness breaks.",
        confidence: 68,
        actionable: true,
        basedOn: ["screen time", "focus scores"],
      })
    }
  }

  // Goal-specific recommendations
  if (userProfile.fitnessGoal === "Lose Weight") {
    const recentMeals = healthData.filter((d) => d.type === "meal").slice(-7)
    if (recentMeals.length > 0) {
      recommendations.push({
        id: "weight-loss",
        type: "suggestion",
        title: "Weight Loss Strategy",
        description: "Focus on portion control and increase your workout intensity. Track your meals consistently.",
        confidence: 70,
        actionable: true,
        basedOn: ["fitness goal", "meal logs"],
      })
    }
  }

  if (userProfile.fitnessGoal === "Better Sleep") {
    recommendations.push({
      id: "sleep-optimization",
      type: "suggestion",
      title: "Sleep Optimization Plan",
      description: "Establish a consistent bedtime routine and avoid screens 1 hour before bed.",
      confidence: 82,
      actionable: true,
      basedOn: ["fitness goal", "sleep patterns"],
    })
  }

  return recommendations.slice(0, 6) // Return top 6 recommendations
}

export function calculateCorrelation(data: HealthData[], xKey: keyof HealthData, yKey: keyof HealthData): number {
  const validData = data.filter((d) => d[xKey] !== undefined && d[yKey] !== undefined)

  if (validData.length < 2) return 0

  const xValues = validData.map((d) => Number(d[xKey]))
  const yValues = validData.map((d) => Number(d[yKey]))

  const xMean = xValues.reduce((sum, val) => sum + val, 0) / xValues.length
  const yMean = yValues.reduce((sum, val) => sum + val, 0) / yValues.length

  let numerator = 0
  let xSumSquares = 0
  let ySumSquares = 0

  for (let i = 0; i < xValues.length; i++) {
    const xDiff = xValues[i] - xMean
    const yDiff = yValues[i] - yMean

    numerator += xDiff * yDiff
    xSumSquares += xDiff * xDiff
    ySumSquares += yDiff * yDiff
  }

  const denominator = Math.sqrt(xSumSquares * ySumSquares)

  return denominator === 0 ? 0 : numerator / denominator
}

export function detectPatterns(healthData: HealthData[]): string[] {
  const patterns: string[] = []

  // Weekend vs weekday patterns
  const weekendData = healthData.filter((d) => {
    const day = new Date(d.date).getDay()
    return day === 0 || day === 6
  })

  const weekdayData = healthData.filter((d) => {
    const day = new Date(d.date).getDay()
    return day >= 1 && day <= 5
  })

  if (weekendData.length > 0 && weekdayData.length > 0) {
    const weekendSleep =
      weekendData.filter((d) => d.sleepDuration).reduce((sum, d) => sum + (d.sleepDuration || 0), 0) /
      weekendData.filter((d) => d.sleepDuration).length
    const weekdaySleep =
      weekdayData.filter((d) => d.sleepDuration).reduce((sum, d) => sum + (d.sleepDuration || 0), 0) /
      weekdayData.filter((d) => d.sleepDuration).length

    if (Math.abs(weekendSleep - weekdaySleep) > 1) {
      patterns.push(
        `Sleep pattern varies significantly between weekdays (${weekdaySleep.toFixed(1)}h) and weekends (${weekendSleep.toFixed(1)}h)`,
      )
    }
  }

  // Consistency patterns
  const sleepData = healthData.filter((d) => d.sleepDuration).slice(-14)
  if (sleepData.length > 7) {
    const sleepTimes = sleepData.map((d) => d.sleepDuration || 0)
    const variance =
      sleepTimes.reduce((sum, time) => {
        const mean = sleepTimes.reduce((s, t) => s + t, 0) / sleepTimes.length
        return sum + Math.pow(time - mean, 2)
      }, 0) / sleepTimes.length

    if (variance < 0.5) {
      patterns.push("Very consistent sleep schedule - great for circadian rhythm!")
    } else if (variance > 2) {
      patterns.push("Irregular sleep schedule detected - consider establishing a routine")
    }
  }

  // Workout timing patterns
  const workouts = healthData.filter((d) => d.type === "workout").slice(-10)
  if (workouts.length > 3) {
    const morningWorkouts = workouts.filter((d) => {
      const hour = new Date(d.date).getHours()
      return hour >= 6 && hour <= 10
    }).length

    if (morningWorkouts / workouts.length > 0.7) {
      patterns.push("You prefer morning workouts - excellent for energy and metabolism!")
    }
  }

  return patterns
}
