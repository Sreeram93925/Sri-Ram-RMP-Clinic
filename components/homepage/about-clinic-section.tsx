import { Heart, FileText, CalendarDays, Users } from "lucide-react"

const highlights = [
  {
    icon: Heart,
    text: "Affordable primary healthcare for the local community",
  },
  {
    icon: FileText,
    text: "Digital health records maintained for every patient",
  },
  {
    icon: CalendarDays,
    text: "Organized appointment scheduling system",
  },
  {
    icon: Users,
    text: "Patient-centered care with a personal touch",
  },
]

export function AboutClinicSection() {
  return (
    <section id="clinic" className="bg-secondary/40 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            About Us
          </p>
          <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
            About the Clinic
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Sri Ram RMP Clinic is a trusted neighborhood healthcare center
            dedicated to providing quality primary healthcare services at
            affordable costs. We believe in combining traditional care with
            modern digital tools to deliver the best experience for our patients.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {highlights.map((item) => (
            <div
              key={item.text}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="size-5 text-primary" />
              </div>
              <p className="text-sm font-medium leading-relaxed text-foreground">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
