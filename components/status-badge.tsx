"use client"

import { Badge } from "@/components/ui/badge"
import { STATUS_LABELS, type AppointmentStatus } from "@/lib/types"

const statusStyles: Record<AppointmentStatus, string> = {
  waiting: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  "in-progress": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
  completed: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700",
  cancelled: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
}

const statusDots: Record<AppointmentStatus, string> = {
  waiting: "bg-amber-500",
  confirmed: "bg-emerald-500",
  "in-progress": "bg-blue-500",
  completed: "bg-slate-400",
  cancelled: "bg-red-500",
}

interface StatusBadgeProps {
  status: AppointmentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={`gap-1.5 font-medium text-xs ${statusStyles[status]}`}>
      <span className={`size-1.5 rounded-full ${statusDots[status]}`} />
      {STATUS_LABELS[status]}
    </Badge>
  )
}
