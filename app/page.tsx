"use client"

import { useState } from "react"
import { StoreProvider, useStore } from "@/lib/store"
import { AppShell } from "@/components/app-shell"
import { Homepage } from "@/components/homepage/homepage"

function AppContent() {
  const { currentUser, login } = useStore()
  const [showApp, setShowApp] = useState(false)

  const handleQuickLogin = async (role: string) => {
    const credentials: Record<string, { email: string; pass: string }> = {
      admin: { email: "admin@clinic.com", pass: "admin123" },
      doctor: { email: "doctor@clinic.com", pass: "doctor123" },
      receptionist: { email: "reception@clinic.com", pass: "reception123" },
      patient: { email: "patient@clinic.com", pass: "patient123" },
    }

    const creds = credentials[role]
    if (creds) {
      const success = await login(creds.email, creds.pass)
      if (success) {
        setShowApp(true)
      }
    }
  }

  // If user is already logged in (session restored from localStorage), show dashboard
  if (currentUser || showApp) {
    return <AppShell onBackToHome={() => setShowApp(false)} />
  }

  return <Homepage onLogin={() => setShowApp(true)} onQuickLogin={handleQuickLogin} />
}

export default function Page() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  )
}
