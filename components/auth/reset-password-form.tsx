"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react"

interface ResetPasswordFormProps {
  onSwitchToLogin: () => void
}

export function ResetPasswordForm({ onSwitchToLogin }: ResetPasswordFormProps) {
  const { resetPassword, isLoading, error, clearError } = useAuth()
  const [email, setEmail] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      await resetPassword({ email })
      setIsSuccess(true)
    } catch (err) {
      // Error is handled by the auth context
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-700">Check Your Email</CardTitle>
          <CardDescription>We've sent a password reset link to your email address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              If you don't see the email in your inbox, please check your spam folder.
            </p>
            <Button onClick={onSwitchToLogin} variant="outline" className="w-full bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="mb-4">
          <img
            src="/images/health-conditions.jpg"
            alt="Reset Password"
            className="w-full h-32 object-cover rounded-lg shadow-lg"
          />
        </div>
        <CardTitle className="text-2xl font-bold text-emerald-700">Reset Password</CardTitle>
        <CardDescription>Enter your email to receive a password reset link</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={onSwitchToLogin}
            className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-medium inline-flex items-center"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to Sign In
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
