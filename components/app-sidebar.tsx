"use client"

import { useStore } from "@/lib/store"
import type { UserRole } from "@/lib/types"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Heart,
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  LogOut,
  User,
} from "lucide-react"

interface AppSidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const navByRole: Record<UserRole, { label: string; icon: React.ElementType; page: string }[]> = {
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
    { label: "Patients", icon: Users, page: "patients" },
    { label: "Appointments", icon: CalendarDays, page: "appointments" },
    { label: "Health Records", icon: FileText, page: "records" },
  ],
  doctor: [
    { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
    { label: "Appointments", icon: CalendarDays, page: "appointments" },
    { label: "Health Records", icon: FileText, page: "records" },
    { label: "Patients", icon: Users, page: "patients" },
  ],
  receptionist: [
    { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
    { label: "Patients", icon: Users, page: "patients" },
    { label: "Appointments", icon: CalendarDays, page: "appointments" },
  ],
  patient: [
    { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
    { label: "Appointments", icon: CalendarDays, page: "appointments" },
    { label: "Health Records", icon: FileText, page: "records" },
  ],
}

const roleColors: Record<UserRole, string> = {
  admin: "bg-primary text-primary-foreground",
  doctor: "bg-accent text-accent-foreground",
  receptionist: "bg-chart-3 text-white",
  patient: "bg-chart-4 text-white",
}

export function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const { currentUser, logout } = useStore()

  if (!currentUser) return null

  const items = navByRole[currentUser.role] || []
  const roleLabel = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary shadow-sm">
            <Heart className="size-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-foreground leading-tight">Sri Ram RMP</span>
            <span className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wider font-medium">Health Records</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-semibold text-sidebar-foreground/40">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.page}>
                  <SidebarMenuButton
                    isActive={currentPage === item.page}
                    onClick={() => onNavigate(item.page)}
                    tooltip={item.label}
                    className="transition-colors"
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent p-3">
          <div className={`flex size-9 items-center justify-center rounded-lg ${roleColors[currentUser.role]} shadow-sm`}>
            <User className="size-4" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs font-semibold text-sidebar-foreground truncate">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wider font-medium">{roleLabel}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg"
            onClick={logout}
            aria-label="Sign out"
          >
            <LogOut className="size-3.5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
