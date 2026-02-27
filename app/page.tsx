"use client"

import { useState } from "react"
import { StoreProvider } from "@/lib/store"
import { AppShell } from "@/components/app-shell"
import { Homepage } from "@/components/homepage/homepage"

export default function Page() {
  const [showApp, setShowApp] = useState(false)

  if (showApp) {
    return (
      <StoreProvider>
        <AppShell onBackToHome={() => setShowApp(false)} />
      </StoreProvider>
    )
  }

  return <Homepage onLogin={() => setShowApp(true)} />
}
