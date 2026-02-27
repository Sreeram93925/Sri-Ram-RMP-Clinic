import { Card, CardContent } from "@/components/ui/card"
import {
  GraduationCap,
  Clock,
  Stethoscope,
  Phone,
  MapPin,
  Award,
} from "lucide-react"

const infoItems = [
  {
    icon: GraduationCap,
    label: "Qualification",
    value: "RMP Certified",
  },
  {
    icon: Award,
    label: "Experience",
    value: "10+ Years",
  },
  {
    icon: Stethoscope,
    label: "Specialization",
    value: "General Medicine",
  },
  {
    icon: Phone,
    label: "Contact",
    value: "+91 98765 43210",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "12, Main Road, Near Bus Stand, Anantapur, AP - 515001",
  },
]

const timings = [
  { session: "Morning", hours: "10:00 AM - 1:00 PM" },
  { session: "Evening", hours: "4:00 PM - 8:00 PM" },
]

export function DoctorInfoSection() {
  return (
    <section id="doctor" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Meet Your Doctor
          </p>
          <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
            Doctor Information
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Info Cards */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {infoItems.map((item) => (
                <Card key={item.label} className="border border-border shadow-sm">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground leading-relaxed">
                        {item.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Clinic Timings */}
          <Card className="border border-border shadow-sm">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent/15">
                  <Clock className="size-5 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Clinic Timings
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                {timings.map((t) => (
                  <div
                    key={t.session}
                    className="rounded-lg border border-border bg-secondary/50 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t.session}
                    </p>
                    <p className="mt-1 text-base font-bold text-foreground">
                      {t.hours}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-xs text-muted-foreground">
                Closed on Sundays & Public Holidays
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
