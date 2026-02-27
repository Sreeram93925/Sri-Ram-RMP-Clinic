import { Card, CardContent } from "@/components/ui/card"
import { FileText, CalendarCheck, ClipboardList, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Digital Patient Records",
    description:
      "Complete digital health records for every patient, easily accessible and securely stored. No more paper files.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Appointment Booking",
    description:
      "Simple and efficient appointment scheduling with real-time slot availability and automated queue management.",
  },
  {
    icon: ClipboardList,
    title: "Consultation History",
    description:
      "Track every consultation with symptoms, diagnosis, prescriptions, and follow-up dates in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Role-Based Access",
    description:
      "Separate access for Admin, Doctor, Receptionist, and Patients with appropriate permissions for each role.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            System Features
          </p>
          <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
            Why Choose Our Digital Health System
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
            Our lightweight digital platform modernizes your clinic operations
            without the complexity of hospital-grade software.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border border-border shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <feature.icon className="size-7 text-primary" />
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
