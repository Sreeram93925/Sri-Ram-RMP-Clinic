import { Heart, Phone, MapPin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Clinic Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Heart className="size-4 text-primary-foreground" />
              </div>
              <span className="text-base font-bold text-foreground">
                Sri Ram RMP Clinic
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Trusted primary healthcare services for the local community.
              Providing compassionate, affordable care with modern digital
              health record management.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Contact
            </h4>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4 shrink-0 text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>12, Main Road, Near Bus Stand, Anantapur, AP - 515001</span>
              </div>
            </div>
          </div>

          {/* Timings */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Clinic Hours
            </h4>
            <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Morning:</span>{" "}
                10:00 AM - 1:00 PM
              </p>
              <p>
                <span className="font-medium text-foreground">Evening:</span>{" "}
                4:00 PM - 8:00 PM
              </p>
              <p className="mt-1 text-xs">Closed on Sundays & Public Holidays</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Sri Ram RMP Clinic. All rights
            reserved. | Digital Health Records & Appointment Management System
          </p>
        </div>
      </div>
    </footer>
  )
}
