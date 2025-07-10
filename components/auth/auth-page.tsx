"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import { ResetPasswordForm } from "./reset-password-form"

type AuthMode = "login" | "signup" | "reset"

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <img src="/images/health-hero.jpg" alt="Health background" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {mode === "login" && (
          <LoginForm onSwitchToSignup={() => setMode("signup")} onSwitchToReset={() => setMode("reset")} />
        )}
        {mode === "signup" && <SignupForm onSwitchToLogin={() => setMode("login")} />}
        {mode === "reset" && <ResetPasswordForm onSwitchToLogin={() => setMode("login")} />}
      </div>
    </div>
  )
}
