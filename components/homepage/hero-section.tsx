import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CalendarDays, LogIn } from "lucide-react"

interface HeroSectionProps {
  onBookAppointment: () => void
  onLogin: () => void
}

export function HeroSection({ onBookAppointment, onLogin }: HeroSectionProps) {
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
        </div>
      </div>
    </section>
  )
}
