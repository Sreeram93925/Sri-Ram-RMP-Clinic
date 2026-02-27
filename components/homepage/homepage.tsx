"use client"

import { useCallback } from "react"
import { SiteHeader } from "./site-header"
import { HeroSection } from "./hero-section"
import { DoctorInfoSection } from "./doctor-info-section"
import { AboutClinicSection } from "./about-clinic-section"
import { FeaturesSection } from "./features-section"
import { SiteFooter } from "./site-footer"

interface HomepageProps {
  onLogin: () => void
}

export function Homepage({ onLogin }: HomepageProps) {
  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader onNavigate={scrollToSection} onLogin={onLogin} />
      <main className="flex-1">
        <HeroSection onBookAppointment={onLogin} onLogin={onLogin} />
        <DoctorInfoSection />
        <AboutClinicSection />
        <FeaturesSection />
      </main>
      <SiteFooter />
    </div>
  )
}
