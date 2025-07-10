import type { User, LoginCredentials, SignupCredentials, ResetPasswordData } from "@/types/auth"

// Simulated user database
const USERS_KEY = "health_dashboard_users"
const CURRENT_USER_KEY = "health_dashboard_current_user"

interface StoredUser extends User {
  password: string
}

// Helper functions for localStorage
const getUsers = (): StoredUser[] => {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

const saveUsers = (users: StoredUser[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

const setCurrentUser = (user: User | null) => {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Hash password (in real app, use proper hashing like bcrypt)
const hashPassword = (password: string): string => {
  return btoa(password + "health_dashboard_salt")
}

// Verify password
const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash
}

// Generate user ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Auth service
export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    await delay(1000) // Simulate API call

    const { email, password } = credentials

    if (!isValidEmail(email)) {
      throw new Error("Please enter a valid email address")
    }

    if (!password) {
      throw new Error("Password is required")
    }

    const users = getUsers()
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      throw new Error("No account found with this email address")
    }

    if (!verifyPassword(password, user.password)) {
      throw new Error("Invalid password")
    }

    // Update last login
    user.lastLogin = new Date()
    saveUsers(users)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    setCurrentUser(userWithoutPassword)

    return userWithoutPassword
  },

  async signup(credentials: SignupCredentials): Promise<User> {
    await delay(1200) // Simulate API call

    const { name, email, password, confirmPassword, agreeToTerms } = credentials

    // Validation
    if (!name.trim()) {
      throw new Error("Name is required")
    }

    if (!isValidEmail(email)) {
      throw new Error("Please enter a valid email address")
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long")
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match")
    }

    if (!agreeToTerms) {
      throw new Error("You must agree to the terms and conditions")
    }

    const users = getUsers()

    // Check if user already exists
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists")
    }

    // Create new user
    const newUser: StoredUser = {
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashPassword(password),
      createdAt: new Date(),
      lastLogin: new Date(),
      emailVerified: false,
      preferences: {
        theme: "system",
        notifications: true,
        dataSharing: false,
        language: "en",
      },
    }

    users.push(newUser)
    saveUsers(users)

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser
    setCurrentUser(userWithoutPassword)

    return userWithoutPassword
  },

  async logout(): Promise<void> {
    await delay(500) // Simulate API call
    setCurrentUser(null)
  },

  async resetPassword(data: ResetPasswordData): Promise<void> {
    await delay(1000) // Simulate API call

    const { email } = data

    if (!isValidEmail(email)) {
      throw new Error("Please enter a valid email address")
    }

    const users = getUsers()
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      throw new Error("No account found with this email address")
    }

    // In a real app, you would send a reset email here
    // For demo purposes, we'll just simulate success
    console.log(`Password reset email sent to ${email}`)
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await delay(800) // Simulate API call

    const users = getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Update user data
    const updatedUser = { ...users[userIndex], ...data }
    users[userIndex] = updatedUser
    saveUsers(users)

    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser
    setCurrentUser(userWithoutPassword)

    return userWithoutPassword
  },

  getCurrentUser(): User | null {
    return getCurrentUser()
  },

  isAuthenticated(): boolean {
    return getCurrentUser() !== null
  },
}
