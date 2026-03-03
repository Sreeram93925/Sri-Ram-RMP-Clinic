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
  Mail,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

  if (currentUser.isEmailVerified === false && currentUser.role !== "admin") {
    return <UnverifiedScreen user={currentUser} onBackToHome={onBackToHome} />
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

import { type User } from "@/lib/types"

function UnverifiedScreen({ user, onBackToHome }: { user: User, onBackToHome?: () => void }) {
  const { logout } = useStore()
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<{ success: boolean; message: string } | null>(null)

  const handleResend = async () => {
    setIsResending(true)
    setResendStatus(null)
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      })
      const data = await res.json()
      if (res.ok) {
        setResendStatus({ success: true, message: "A new verification link has been sent to your email." })
      } else {
        setResendStatus({ success: false, message: data.error || "Failed to resend email." })
      }
    } catch (e) {
      setResendStatus({ success: false, message: "Network error. Please try again." })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-6 w-full">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Mail className="size-10 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground text-balance">
            Hi {user.name}, we've sent a verification link to <strong>{user.email}</strong>.
            Please check your inbox and click the link to activate your account.
          </p>

          <div className="pt-2 space-y-3">
            <Button
              onClick={handleResend}
              disabled={isResending}
              className="w-full h-11 font-semibold"
            >
              {isResending ? "Sending..." : "Resend Verification Email"}
            </Button>

            <Button
              variant="outline"
              onClick={logout}
              className="w-full h-11"
            >
              Back to Sign In
            </Button>

            {resendStatus && (
              <div className={`text-sm p-3 rounded-lg border ${resendStatus.success ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {resendStatus.message}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
