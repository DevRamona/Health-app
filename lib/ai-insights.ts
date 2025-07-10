import type { HealthData, UserProfile, Recommendation } from "@/types/health"

export function generateRecommendations(healthData: HealthData[], userProfile: UserProfile): Recommendation[] {
  const recommendations: Recommendation[] = []

  if (healthData.length === 0) {
    return [
      {
        id: "welcome",
        type: "suggestion",
        title: "Start Your Health Journey",
        description: "Begin by logging your daily health metrics to get personalized insights and recommendations.",
        confidence: 100,
        basedOn: ["User Profile"],
        actionable: true,
        priority: "high",
      },
    ]
  }

  // Sleep analysis
  const sleepData = healthData.filter((d) => d.sleepDuration).slice(-7)
  if (sleepData.length > 0) {
    const avgSleep = sleepData.reduce((sum, d) => sum + (d.sleepDuration || 0), 0) / sleepData.length

    if (avgSleep < userProfile.sleepGoal) {
      recommendations.push({
        id: "sleep-deficit",
        type: "warning",
        title: "Sleep Deficit Detected",
        description: `Your average sleep (${avgSleep.toFixed(1)}h) is below your goal (${userProfile.sleepGoal}h). Consider improving your sleep hygiene.`,
        confidence: 85,
        basedOn: ["Sleep Duration", "Sleep Goal"],
        actionable: true,
        priority: "high",
      })
    }

    // Sleep quality correlation
    const qualityData = sleepData.filter((d) => d.sleepQuality)
    if (qualityData.length > 2) {
      const avgQuality = qualityData.reduce((sum, d) => sum + (d.sleepQuality || 0), 0) / qualityData.length
      if (avgQuality < 6) {
        recommendations.push({
          id: "sleep-quality",
          type: "suggestion",
          title: "Improve Sleep Quality",
          description:
            "Your sleep quality scores suggest room for improvement. Try establishing a consistent bedtime routine.",
          confidence: 75,
          basedOn: ["Sleep Quality"],
          actionable: true,
          priority: "medium",
        })
      }
    }
  }

  // Mood and energy correlation
  const moodData = healthData.filter((d) => d.mood && d.energy).slice(-14)
  if (moodData.length > 5) {
    const correlation = calculateCorrelation(moodData, "mood", "energy")
    if (correlation > 0.6) {
      recommendations.push({
        id: "mood-energy-correlation",
        type: "insight",
        title: "Strong Mood-Energy Connection",
        description: `Your mood and energy levels are highly correlated (${(correlation * 100).toFixed(0)}%). Focus on activities that boost both.`,
        confidence: Math.round(Math.abs(correlation) * 100),
        basedOn: ["Mood", "Energy"],
        actionable: true,
        priority: "medium",
      })
    }
  }

  // Exercise patterns
  const workoutData = healthData.filter((d) => d.type === "workout").slice(-7)
  if (workoutData.length < 3) {
    recommendations.push({
      id: "exercise-frequency",
      type: "suggestion",
      title: "Increase Exercise Frequency",
      description:
        "You've logged fewer than 3 workouts this week. Regular exercise can improve mood, energy, and sleep quality.",
      confidence: 80,
      basedOn: ["Workout Frequency"],
      actionable: true,
      priority: "medium",
    })
  }

  // Stress patterns
  const stressData = healthData.filter((d) => d.stress).slice(-7)
  if (stressData.length > 0) {
    const avgStress = stressData.reduce((sum, d) => sum + (d.stress || 0), 0) / stressData.length
    if (avgStress > 7) {
      recommendations.push({
        id: "high-stress",
        type: "warning",
        title: "Elevated Stress Levels",
        description: `Your average stress level (${avgStress.toFixed(1)}/10) is high. Consider stress management techniques like meditation or deep breathing.`,
        confidence: 90,
        basedOn: ["Stress Level"],
        actionable: true,
        priority: "high",
      })
    }
  }

  // Water intake
  const waterData = healthData.filter((d) => d.waterIntake).slice(-7)
  if (waterData.length > 0) {
    const avgWater = waterData.reduce((sum, d) => sum + (d.waterIntake || 0), 0) / waterData.length
    if (avgWater < 64) {
      // Less than 64 oz per day
      recommendations.push({
        id: "hydration",
        type: "suggestion",
        title: "Increase Water Intake",
        description: `Your average water intake (${avgWater.toFixed(0)} oz) is below recommended levels. Aim for at least 64 oz daily.`,
        confidence: 70,
        basedOn: ["Water Intake"],
        actionable: true,
        priority: "low",
      })
    }
  }

  // Screen time analysis
  const screenData = healthData.filter((d) => d.screenTime).slice(-7)
  if (screenData.length > 0) {
    const avgScreen = screenData.reduce((sum, d) => sum + (d.screenTime || 0), 0) / screenData.length
    if (avgScreen > 8) {
      recommendations.push({
        id: "screen-time",
        type: "warning",
        title: "High Screen Time",
        description: `Your average screen time (${avgScreen.toFixed(1)} hours) may be affecting your sleep and focus. Consider digital detox periods.`,
        confidence: 75,
        basedOn: ["Screen Time"],
        actionable: true,
        priority: "medium",
      })
    }
  }

  return recommendations.slice(0, 8) // Return top 8 recommendations
}

export function calculateCorrelation(data: HealthData[], xKey: keyof HealthData, yKey: keyof HealthData): number {
  const validData = data.filter(
    (d) =>
      typeof d[xKey] === "number" &&
      typeof d[yKey] === "number" &&
      !isNaN(d[xKey] as number) &&
      !isNaN(d[yKey] as number),
  )

  if (validData.length < 2) return 0

  const n = validData.length
  const sumX = validData.reduce((sum, d) => sum + (d[xKey] as number), 0)
  const sumY = validData.reduce((sum, d) => sum + (d[yKey] as number), 0)
  const sumXY = validData.reduce((sum, d) => sum + (d[xKey] as number) * (d[yKey] as number), 0)
  const sumX2 = validData.reduce((sum, d) => sum + Math.pow(d[xKey] as number, 2), 0)
  const sumY2 = validData.reduce((sum, d) => sum + Math.pow(d[yKey] as number, 2), 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

  return denominator === 0 ? 0 : numerator / denominator
}

export function detectPatterns(healthData: HealthData[]): string[] {
  const patterns: string[] = []

  if (healthData.length < 7) {
    return ["Need more data to detect meaningful patterns. Keep logging!"]
  }

  // Weekly patterns
  const weeklyData = Array(7)
    .fill(0)
    .map(() => ({ sleep: [], mood: [], energy: [] }))

  healthData.forEach((d) => {
    const dayOfWeek = new Date(d.date).getDay()
    if (d.sleepDuration) weeklyData[dayOfWeek].sleep.push(d.sleepDuration)
    if (d.mood) weeklyData[dayOfWeek].mood.push(d.mood)
    if (d.energy) weeklyData[dayOfWeek].energy.push(d.energy)
  })

  // Find best and worst days
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // Sleep patterns
  const sleepAverages = weeklyData
    .map((day, index) => ({
      day: dayNames[index],
      avg: day.sleep.length > 0 ? day.sleep.reduce((a, b) => a + b, 0) / day.sleep.length : 0,
    }))
    .filter((d) => d.avg > 0)

  if (sleepAverages.length > 0) {
    const bestSleepDay = sleepAverages.reduce((best, current) => (current.avg > best.avg ? current : best))
    const worstSleepDay = sleepAverages.reduce((worst, current) => (current.avg < worst.avg ? current : worst))

    if (bestSleepDay.avg - worstSleepDay.avg > 1) {
      patterns.push(
        `You sleep best on ${bestSleepDay.day}s (${bestSleepDay.avg.toFixed(1)}h) and least on ${worstSleepDay.day}s (${worstSleepDay.avg.toFixed(1)}h)`,
      )
    }
  }

  // Mood patterns
  const moodAverages = weeklyData
    .map((day, index) => ({
      day: dayNames[index],
      avg: day.mood.length > 0 ? day.mood.reduce((a, b) => a + b, 0) / day.mood.length : 0,
    }))
    .filter((d) => d.avg > 0)

  if (moodAverages.length > 0) {
    const bestMoodDay = moodAverages.reduce((best, current) => (current.avg > best.avg ? current : best))
    const worstMoodDay = moodAverages.reduce((worst, current) => (current.avg < worst.avg ? current : worst))

    if (bestMoodDay.avg - worstMoodDay.avg > 1.5) {
      patterns.push(
        `Your mood peaks on ${bestMoodDay.day}s (${bestMoodDay.avg.toFixed(1)}/10) and dips on ${worstMoodDay.day}s (${worstMoodDay.avg.toFixed(1)}/10)`,
      )
    }
  }

  // Workout impact
  const workoutDays = healthData.filter((d) => d.type === "workout")
  if (workoutDays.length > 2) {
    const workoutMoodAvg = workoutDays.reduce((sum, d) => sum + (d.mood || 0), 0) / workoutDays.length
    const nonWorkoutDays = healthData.filter((d) => d.type !== "workout" && d.mood)

    if (nonWorkoutDays.length > 0) {
      const nonWorkoutMoodAvg = nonWorkoutDays.reduce((sum, d) => sum + (d.mood || 0), 0) / nonWorkoutDays.length

      if (workoutMoodAvg > nonWorkoutMoodAvg + 0.5) {
        patterns.push(`Your mood is ${(workoutMoodAvg - nonWorkoutMoodAvg).toFixed(1)} points higher on workout days`)
      }
    }
  }

  // Sleep-mood correlation
  const sleepMoodData = healthData.filter((d) => d.sleepDuration && d.mood)
  if (sleepMoodData.length > 5) {
    const correlation = calculateCorrelation(sleepMoodData, "sleepDuration", "mood")
    if (Math.abs(correlation) > 0.5) {
      patterns.push(
        `Strong ${correlation > 0 ? "positive" : "negative"} correlation between sleep and mood (${(correlation * 100).toFixed(0)}%)`,
      )
    }
  }

  return patterns.length > 0 ? patterns : ["Keep logging data to discover your personal health patterns!"]
}

export function generateInsights(healthData: HealthData[], userProfile: UserProfile) {
  const insights = {
    weeklyAverage: {
      sleep: 0,
      mood: 0,
      energy: 0,
      workouts: 0,
      steps: 0,
    },
    trends: {
      sleep: 0,
      mood: 0,
      energy: 0,
    },
    correlations: {
      sleepMood: 0,
      exerciseEnergy: 0,
      stressSleep: 0,
    },
    patterns: detectPatterns(healthData),
    recommendations: generateRecommendations(healthData, userProfile),
  }

  // Calculate weekly averages
  const recentData = healthData.slice(-7)

  const sleepData = recentData.filter((d) => d.sleepDuration)
  insights.weeklyAverage.sleep =
    sleepData.length > 0 ? sleepData.reduce((sum, d) => sum + (d.sleepDuration || 0), 0) / sleepData.length : 0

  const moodData = recentData.filter((d) => d.mood)
  insights.weeklyAverage.mood =
    moodData.length > 0 ? moodData.reduce((sum, d) => sum + (d.mood || 0), 0) / moodData.length : 0

  const energyData = recentData.filter((d) => d.energy)
  insights.weeklyAverage.energy =
    energyData.length > 0 ? energyData.reduce((sum, d) => sum + (d.energy || 0), 0) / energyData.length : 0

  insights.weeklyAverage.workouts = recentData.filter((d) => d.type === "workout").length

  const stepsData = recentData.filter((d) => d.steps)
  insights.weeklyAverage.steps =
    stepsData.length > 0 ? stepsData.reduce((sum, d) => sum + (d.steps || 0), 0) / stepsData.length : 0

  // Calculate correlations
  insights.correlations.sleepMood = calculateCorrelation(healthData, "sleepDuration", "mood")
  insights.correlations.exerciseEnergy = calculateCorrelation(healthData, "workoutDuration", "energy")
  insights.correlations.stressSleep = calculateCorrelation(healthData, "stress", "sleepQuality")

  return insights
}
