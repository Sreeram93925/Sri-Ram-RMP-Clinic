"use client"

import { useState } from "react"
import { StoreProvider, useStore } from "@/lib/store"
import { AppShell } from "@/components/app-shell"
import { Homepage } from "@/components/homepage/homepage"

function AppContent() {
  const { currentUser } = useStore()
  const [showApp, setShowApp] = useState(false)

  // If user is already logged in (session restored from localStorage), show dashboard
  if (currentUser || showApp) {
    return <AppShell onBackToHome={() => setShowApp(false)} />
  }

  return <Homepage onLogin={() => setShowApp(true)} />
}

export default function Page() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  )
}
