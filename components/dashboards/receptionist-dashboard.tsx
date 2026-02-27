"use client"

import { useStore } from "@/lib/store"
import { StatCard } from "@/components/stat-card"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CalendarDays, UserPlus, Clock, ArrowRight, ClipboardList } from "lucide-react"

interface ReceptionistDashboardProps {
  onNavigate: (page: string) => void
}

export function ReceptionistDashboard({ onNavigate }: ReceptionistDashboardProps) {
  const { patients, appointments } = useStore()

  const today = new Date().toISOString().split("T")[0]
  const todayAppointments = appointments.filter((a) => a.date === today)
  const todayRegistrations = patients.filter((p) => p.registrationDate === today)
  const waitingPatients = todayAppointments.filter((a) => a.status === "waiting")

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-chart-3 p-6 text-foreground relative overflow-hidden" style={{ color: "white" }}>
        <div className="absolute top-0 right-0 size-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-1/3 size-20 rounded-full bg-white/5 translate-y-10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="size-5" />
            <Badge variant="secondary" className="bg-white/15 text-white border-0 text-[10px] font-semibold uppercase tracking-wider">
              Front Desk
            </Badge>
          </div>
          <h1 className="text-2xl font-bold mt-2">Reception Dashboard</h1>
          <p className="text-white/70 text-sm mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Today's Bookings"
          value={todayAppointments.length}
          icon={CalendarDays}
          description={`${todayAppointments.filter((a) => a.status === "completed").length} completed`}
          accentColor="bg-primary/10 text-primary"
        />
        <StatCard
          title="New Registrations"
          value={todayRegistrations.length}
          icon={UserPlus}
          description="Registered today"
          accentColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Waiting Patients"
          value={waitingPatients.length}
          icon={Clock}
          description="Currently in queue"
          accentColor="bg-chart-3/10 text-chart-3"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => onNavigate("patients")} className="gap-2">
          <UserPlus className="size-4" />
          Register New Patient
        </Button>
        <Button variant="outline" onClick={() => onNavigate("appointments")} className="gap-2">
          Book Appointment
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {/* Waiting List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Waiting List
                {waitingPatients.length > 0 && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {waitingPatients.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">Patients currently waiting for consultation</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {waitingPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
                <Clock className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No patients waiting</p>
              <p className="text-xs text-muted-foreground mt-1">The waiting list is currently empty.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Time</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Patient</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitingPatients.map((appt) => {
                    const patient = patients.find((p) => p.id === appt.patientId)
                    return (
                      <TableRow key={appt.id}>
                        <TableCell className="font-mono text-sm">{appt.timeSlot}</TableCell>
                        <TableCell className="font-medium">{patient?.name || "Unknown"}</TableCell>
                        <TableCell><StatusBadge status={appt.status} /></TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
