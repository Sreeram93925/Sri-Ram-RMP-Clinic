"use client"

import { useState } from "react"
import { StoreProvider, useStore } from "@/lib/store"
import { AppShell } from "@/components/app-shell"
import { Homepage } from "@/components/homepage/homepage"

function AppContent() {
  const { currentUser } = useStore()
  const [showApp, setShowApp] = useState(false)
  const [pendingEmail, setPendingEmail] = useState("")

  const handleQuickLogin = (role: string) => {
    const credentials: Record<string, string> = {
      admin: "admin@clinic.com",
      doctor: "doctor@clinic.com",
      receptionist: "reception@clinic.com",
      patient: "patient@clinic.com",
    }

    const email = credentials[role]
    if (email) {
      setPendingEmail(email)
      setShowApp(true)
    }
  }

  // If user is already logged in (session restored from localStorage), show dashboard
  if (currentUser || showApp) {
    return <AppShell onBackToHome={() => { setShowApp(false); setPendingEmail("") }} initialEmail={pendingEmail} />
  }

  return <Homepage onLogin={() => { setShowApp(true); setPendingEmail("") }} onQuickLogin={handleQuickLogin} />
}

export default function Page() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  )
}
