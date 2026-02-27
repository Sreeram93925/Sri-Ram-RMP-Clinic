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
import { CalendarDays, Users, Clock, CheckCircle, Stethoscope, ArrowRight } from "lucide-react"

interface DoctorDashboardProps {
  onNavigate: (page: string) => void
}

export function DoctorDashboard({ onNavigate }: DoctorDashboardProps) {
  const { currentUser, patients, appointments, consultations } = useStore()

  const today = new Date().toISOString().split("T")[0]
  const myAppointments = appointments.filter((a) => a.doctorId === currentUser?.id)
  const todayAppointments = myAppointments.filter((a) => a.date === today)
  const myConsultations = consultations.filter((c) => c.doctorId === currentUser?.id)
  const waitingNow = todayAppointments.filter((a) => a.status === "waiting" || a.status === "confirmed")

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-accent p-6 text-accent-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 size-32 rounded-full bg-accent-foreground/5 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-1/3 size-20 rounded-full bg-accent-foreground/5 translate-y-10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="size-5" />
            <Badge variant="secondary" className="bg-accent-foreground/15 text-accent-foreground border-0 text-[10px] font-semibold uppercase tracking-wider">
              Doctor
            </Badge>
          </div>
          <h1 className="text-2xl font-bold mt-2">Welcome, {currentUser?.name}</h1>
          <p className="text-accent-foreground/70 text-sm mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Patients"
          value={todayAppointments.length}
          icon={CalendarDays}
          description={`${todayAppointments.filter((a) => a.status === "completed").length} completed`}
          accentColor="bg-primary/10 text-primary"
        />
        <StatCard
          title="Waiting Now"
          value={waitingNow.length}
          icon={Clock}
          description="Patients in queue"
          accentColor="bg-chart-3/10 text-chart-3"
        />
        <StatCard
          title="Total Patients"
          value={patients.length}
          icon={Users}
          description="All registered"
          accentColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="My Consultations"
          value={myConsultations.length}
          icon={CheckCircle}
          description="Total records"
          accentColor="bg-chart-5/10 text-chart-5"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => onNavigate("appointments")} className="gap-2">
          View Appointments
          <ArrowRight className="size-4" />
        </Button>
        <Button variant="outline" onClick={() => onNavigate("records")} className="gap-2">
          Health Records
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {"Today's Schedule"}
                {todayAppointments.length > 0 && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {todayAppointments.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">Your appointments for today</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
                <CalendarDays className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No appointments today</p>
              <p className="text-xs text-muted-foreground mt-1">Your schedule is clear.</p>
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
                  {todayAppointments
                    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                    .map((appt) => {
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
