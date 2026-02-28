import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CalendarDays, LogIn } from "lucide-react"

interface HeroSectionProps {
  onBookAppointment: () => void
  onLogin: () => void
  onQuickLogin?: (role: string) => void
}

export function HeroSection({ onBookAppointment, onLogin, onQuickLogin }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="bg-gradient-to-br from-hero-gradient-from to-hero-gradient-to"
    >
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-8 px-4 py-16 md:flex-row md:gap-12 md:py-24 lg:px-8">
        <div className="flex flex-1 flex-col gap-6 text-center md:text-left">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Registered Medical Practitioner
            </p>
            <h1 className="text-balance text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Dr. Sree Ram, RMP
            </h1>
            <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground md:text-lg">
              A dedicated Registered Medical Practitioner providing compassionate
              primary healthcare services to the community. With years of
              experience in general medicine, Dr. Sree Ram focuses on
              patient-centered care with modern digital health record management.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row md:items-start">
            <Button size="lg" onClick={onBookAppointment} className="gap-2">
              <CalendarDays className="size-4" />
              Book Appointment
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onLogin}
              className="gap-2"
            >
              <LogIn className="size-4" />
              Login to System
            </Button>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="relative overflow-hidden rounded-2xl border-4 border-card shadow-xl">
            <Image
              src="/images/doctor.jpg"
              alt="Dr. Sree Ram - Registered Medical Practitioner"
              width={380}
              height={420}
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="h-auto flex-col py-3 px-2 gap-1.5 border border-primary/10 hover:border-primary/30"
              onClick={() => onQuickLogin?.("admin")}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <LogIn className="size-4" />
              </div>
              <span className="text-xs font-semibold">Admin Access</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-auto flex-col py-3 px-2 gap-1.5 border border-accent/10 hover:border-accent/30"
              onClick={() => onQuickLogin?.("doctor")}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <LogIn className="size-4" />
              </div>
              <span className="text-xs font-semibold">Doctor Access</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-auto flex-col py-3 px-2 gap-1.5 border border-chart-3/10 hover:border-chart-3/30"
              onClick={() => onQuickLogin?.("receptionist")}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
                <LogIn className="size-4" />
              </div>
              <span className="text-xs font-semibold">Receptionist</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-auto flex-col py-3 px-2 gap-1.5 border border-chart-4/10 hover:border-chart-4/30"
              onClick={() => onQuickLogin?.("patient")}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
                <LogIn className="size-4" />
              </div>
              <span className="text-xs font-semibold">Patient Login</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
