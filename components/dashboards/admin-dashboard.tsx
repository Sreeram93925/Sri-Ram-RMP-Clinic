"use client"

import { useStore } from "@/lib/store"
import { StatCard } from "@/components/stat-card"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, Stethoscope, CalendarDays, CheckCircle, Activity } from "lucide-react"

export function AdminDashboard() {
  const { patients, appointments, getDoctors, consultations } = useStore()

  const today = new Date().toISOString().split("T")[0]
  const todayAppointments = appointments.filter((a) => a.date === today)
  const doctors = getDoctors()
  const completedConsultations = consultations.length
  const completedToday = todayAppointments.filter((a) => a.status === "completed").length
  const waitingNow = todayAppointments.filter((a) => a.status === "waiting").length

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-primary p-6 text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 size-32 rounded-full bg-primary-foreground/5 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-1/2 size-24 rounded-full bg-primary-foreground/5 translate-y-12" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="size-5" />
            <Badge variant="secondary" className="bg-primary-foreground/15 text-primary-foreground border-0 text-[10px] font-semibold uppercase tracking-wider">
              Admin Panel
            </Badge>
          </div>
          <h1 className="text-2xl font-bold mt-2">Clinic Overview</h1>
          <p className="text-primary-foreground/70 text-sm mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={patients.length}
          icon={Users}
          description="Registered patients"
          accentColor="bg-primary/10 text-primary"
        />
        <StatCard
          title="Total Doctors"
          value={doctors.length}
          icon={Stethoscope}
          description="Active practitioners"
          accentColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon={CalendarDays}
          description={`${completedToday} completed, ${waitingNow} waiting`}
          accentColor="bg-chart-3/10 text-chart-3"
        />
        <StatCard
          title="Consultations"
          value={completedConsultations}
          icon={CheckCircle}
          description="Total records"
          accentColor="bg-chart-5/10 text-chart-5"
        />
      </div>

      {/* Today's Appointments Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {"Today's Schedule"}
                {todayAppointments.length > 0 && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {todayAppointments.length} appointment{todayAppointments.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">All appointments scheduled for today</CardDescription>
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
              <p className="text-xs text-muted-foreground mt-1">Appointments will appear here when scheduled.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Appointment ID</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Patient</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Doctor</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Time</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAppointments.map((appt) => {
                    const patient = patients.find((p) => p.id === appt.patientId)
                    const doctor = doctors.find((d) => d.id === appt.doctorId)
                    return (
                      <TableRow key={appt.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">{appt.appointmentId}</TableCell>
                        <TableCell className="font-medium">{patient?.name || "Unknown"}</TableCell>
                        <TableCell className="text-muted-foreground">{doctor?.name || "Unknown"}</TableCell>
                        <TableCell className="font-mono text-sm">{appt.timeSlot}</TableCell>
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
