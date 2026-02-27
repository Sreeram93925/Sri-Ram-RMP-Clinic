"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: string
  accentColor?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  accentColor = "bg-primary/10 text-primary",
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
            {trend && (
              <p className="text-xs font-semibold text-accent mt-0.5">{trend}</p>
            )}
          </div>
          <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accentColor}`}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/10" />
    </Card>
  )
}
