"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, AlertCircle, ArrowLeft, ShieldCheck, Clock, FileText, Users } from "lucide-react"

import Link from "next/link"

interface LoginFormProps {
  onBackToHome?: () => void
}

export function LoginForm({ onBackToHome }: LoginFormProps) {
  const { login } = useStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const user = login(email, password)
    if (!user) {
      setError("Invalid email or password")
    }
  }

  const demoAccounts = [
    { role: "Admin", email: "admin@clinic.com", password: "admin123", icon: ShieldCheck, color: "bg-primary/10 text-primary border-primary/20" },
    { role: "Doctor", email: "doctor@clinic.com", password: "doctor123", icon: Heart, color: "bg-accent/10 text-accent border-accent/20" },
    { role: "Receptionist", email: "reception@clinic.com", password: "reception123", icon: Users, color: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
    { role: "Patient", email: "patient@clinic.com", password: "patient123", icon: FileText, color: "bg-chart-4/10 text-chart-4 border-chart-4/20" },
  ]

  return (
    <div className="flex min-h-svh">
      {/* Left panel - branding & illustration */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-10 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-10 size-72 rounded-full bg-primary-foreground/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 size-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        </div>

        <div className="relative z-10">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="mb-8 flex items-center gap-1.5 text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to Home
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
              <Heart className="size-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold">Sri Ram RMP Clinic</span>
              <p className="text-primary-foreground/60 text-xs">Digital Health Records System</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-8">
          <h2 className="text-3xl font-bold leading-tight text-balance">
            Simplifying healthcare management for your clinic
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { icon: Users, text: "Patient registration & records" },
              { icon: Clock, text: "Appointment scheduling" },
              { icon: FileText, text: "Digital consultation notes" },
              { icon: ShieldCheck, text: "Role-based secure access" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <item.icon className="size-4 text-primary-foreground" />
                </div>
                <span className="text-sm text-primary-foreground/80">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-primary-foreground/40">
          Trusted by local clinics for everyday healthcare
        </p>
      </div>

      {/* Right panel - login form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 lg:p-10">
        <div className="w-full max-w-sm">
          {/* Mobile back button */}
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="mb-6 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            >
              <ArrowLeft className="size-4" />
              Back to Home
            </button>
          )}

          {/* Mobile logo */}
          <div className="flex flex-col items-center gap-2 mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
                <Heart className="size-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">Sri Ram RMP</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to access the clinic management system</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 mt-1 font-semibold">
              Sign In
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Create one
              </Link>
            </p>
          </form>

          <div className="mt-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-3 text-muted-foreground">Quick demo access</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {demoAccounts.map((acc) => (
                <Card
                  key={acc.role}
                  className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 border-border/60"
                  onClick={() => {
                    setEmail(acc.email)
                    setPassword(acc.password)
                  }}
                >
                  <CardContent className="flex items-center gap-2.5 p-3">
                    <div className={`flex size-8 items-center justify-center rounded-lg border ${acc.color}`}>
                      <acc.icon className="size-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-foreground">{acc.role}</span>
                      <span className="text-[10px] text-muted-foreground leading-tight">Click to fill</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
