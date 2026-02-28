"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { LoginForm } from "@/components/login-form"
import { AppSidebar } from "@/components/app-sidebar"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { DoctorDashboard } from "@/components/dashboards/doctor-dashboard"
import { ReceptionistDashboard } from "@/components/dashboards/receptionist-dashboard"
import { PatientDashboard } from "@/components/dashboards/patient-dashboard"
import { PatientsPage } from "@/components/pages/patients-page"
import { AppointmentsPage } from "@/components/pages/appointments-page"
import { RecordsPage } from "@/components/pages/records-page"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
} from "lucide-react"

interface AppShellProps {
  onBackToHome?: () => void
  initialEmail?: string
}

export function AppShell({ onBackToHome, initialEmail }: AppShellProps) {
  const { currentUser } = useStore()
  const [currentPage, setCurrentPage] = useState("dashboard")

  if (!currentUser) {
    return <LoginForm onBackToHome={onBackToHome} initialEmail={initialEmail} />
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return renderDashboard()
      case "patients":
        return <PatientsPage />
      case "appointments":
        return <AppointmentsPage />
      case "records":
        return <RecordsPage />
      default:
        return renderDashboard()
    }
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case "admin":
        return <AdminDashboard />
      case "doctor":
        return <DoctorDashboard onNavigate={setCurrentPage} />
      case "receptionist":
        return <ReceptionistDashboard onNavigate={setCurrentPage} />
      case "patient":
        return <PatientDashboard onNavigate={setCurrentPage} />
      default:
        return null
    }
  }

  const pageConfig: Record<string, { title: string; icon: React.ElementType }> = {
    dashboard: { title: "Dashboard", icon: LayoutDashboard },
    patients: { title: "Patients", icon: Users },
    appointments: { title: "Appointments", icon: CalendarDays },
    records: { title: "Health Records", icon: FileText },
  }

  const current = pageConfig[currentPage] || pageConfig.dashboard
  const PageIcon = current.icon

  return (
    <SidebarProvider>
      <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-2">
            <PageIcon className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              {current.title}
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          {renderPage()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
