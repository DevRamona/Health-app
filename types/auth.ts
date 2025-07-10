export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  lastLogin: Date
  emailVerified: boolean
  preferences: {
    theme: "light" | "dark" | "system"
    notifications: boolean
    dataSharing: boolean
    language: string
  }
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface ResetPasswordData {
  email: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignupCredentials) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (data: ResetPasswordData) => Promise<void>
  clearError: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}
