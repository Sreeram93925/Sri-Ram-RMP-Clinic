"use client"

import { useState } from "react"
import { Heart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SiteHeaderProps {
  onNavigate: (section: string) => void
  onLogin: () => void
}

export function SiteHeader({ onNavigate, onLogin }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: "Home", section: "hero" },
    { label: "About Doctor", section: "doctor" },
    { label: "About Clinic", section: "clinic" },
    { label: "Features", section: "features" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="size-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight text-foreground">
              Sri Ram RMP Clinic
            </span>
            <span className="text-[11px] leading-tight text-muted-foreground">
              Trusted Primary Healthcare
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.section}
              onClick={() => onNavigate(link.section)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
            >
              {link.label}
            </button>
          ))}
          <div className="ml-3">
            <Button size="sm" onClick={onLogin}>
              Login
            </Button>
          </div>
        </nav>

        <button
          className="flex size-9 items-center justify-center rounded-md text-foreground md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.section}
                onClick={() => {
                  onNavigate(link.section)
                  setMobileMenuOpen(false)
                }}
                className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
              >
                {link.label}
              </button>
            ))}
            <Button
              className="mt-2"
              size="sm"
              onClick={() => {
                onLogin()
                setMobileMenuOpen(false)
              }}
            >
              Login
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
