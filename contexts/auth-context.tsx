"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { AuthContextType, User, LoginCredentials, SignupCredentials, ResetPasswordData } from "@/types/auth"
import { authService } from "@/lib/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!user

  useEffect(() => {
    // Check for existing user on mount
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      setError(null)
      const user = await authService.login(credentials)
      setUser(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (credentials: SignupCredentials) => {
    try {
      setIsLoading(true)
      setError(null)
      const user = await authService.signup(credentials)
      setUser(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await authService.logout()
      setUser(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed")
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      setIsLoading(true)
      setError(null)
      await authService.resetPassword(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true)
      setError(null)
      if (!user) throw new Error("No user logged in")
      const updatedUser = await authService.updateProfile(user.id, data)
      setUser(updatedUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profile update failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    signup,
    logout,
    resetPassword,
    clearError,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
