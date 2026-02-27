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
import { CalendarDays, FileText, Clock, ArrowRight, User } from "lucide-react"

interface PatientDashboardProps {
  onNavigate: (page: string) => void
}

export function PatientDashboard({ onNavigate }: PatientDashboardProps) {
  const { currentUser, patients, appointments, consultations, getDoctors } = useStore()

  const myPatient = patients.find((p) => p.userId === currentUser?.id)
  const myAppointments = myPatient
    ? appointments.filter((a) => a.patientId === myPatient.id)
    : []
  const myConsultations = myPatient
    ? consultations.filter((c) => c.patientId === myPatient.id)
    : []
  const upcomingAppointments = myAppointments.filter(
    (a) => a.status === "waiting" || a.status === "confirmed"
  )
  const doctors = getDoctors()

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-chart-4 p-6 text-foreground relative overflow-hidden" style={{ color: "white" }}>
        <div className="absolute top-0 right-0 size-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-1/3 size-20 rounded-full bg-white/5 translate-y-10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <User className="size-5" />
            <Badge variant="secondary" className="bg-white/15 text-white border-0 text-[10px] font-semibold uppercase tracking-wider">
              Patient Portal
            </Badge>
          </div>
          <h1 className="text-2xl font-bold mt-2">Welcome, {currentUser?.name}</h1>
          <p className="text-white/70 text-sm mt-1">
            {myPatient ? `Patient ID: ${myPatient.patientId}` : "Manage your health records and appointments"}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="My Appointments"
          value={myAppointments.length}
          icon={CalendarDays}
          description={`${upcomingAppointments.length} upcoming`}
          accentColor="bg-primary/10 text-primary"
        />
        <StatCard
          title="Upcoming"
          value={upcomingAppointments.length}
          icon={Clock}
          description="Scheduled visits"
          accentColor="bg-chart-3/10 text-chart-3"
        />
        <StatCard
          title="Health Records"
          value={myConsultations.length}
          icon={FileText}
          description="Consultation records"
          accentColor="bg-chart-4/10 text-chart-4"
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

      {/* My Appointments Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                My Appointments
                {myAppointments.length > 0 && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {myAppointments.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">Your scheduled and past appointments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {myAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
                <CalendarDays className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No appointments found</p>
              <p className="text-xs text-muted-foreground mt-1">Book your first appointment to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Date</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Time</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Doctor</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...myAppointments]
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((appt) => {
                      const doctor = doctors.find((d) => d.id === appt.doctorId)
                      return (
                        <TableRow key={appt.id}>
                          <TableCell>{appt.date}</TableCell>
                          <TableCell className="font-mono text-sm">{appt.timeSlot}</TableCell>
                          <TableCell className="font-medium">{doctor?.name || "Unknown"}</TableCell>
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
