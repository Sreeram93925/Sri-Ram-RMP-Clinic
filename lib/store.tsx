"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import {
  TIME_SLOTS,
  type User,
  type Patient,
  type Appointment,
  type Consultation,
  type AppointmentStatus,
} from "./types"

interface StoreContextType {
  // Auth
  currentUser: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ user?: User; error?: string }>
  register: (data: { name: string; email: string; password: string; mobile: string; age: number; gender: "male" | "female" | "other"; address?: string }) => Promise<{ user?: User; error?: string }>
  logout: () => Promise<void>

  // Users
  users: User[]
  getDoctors: () => User[]

  // Patients
  patients: Patient[]
  addPatient: (patient: Omit<Patient, "id" | "patientId" | "registrationDate">) => Promise<Patient>
  updatePatient: (id: string, data: Partial<Patient>) => Promise<void>
  getPatientById: (id: string) => Patient | undefined
  searchPatients: (query: string) => Patient[]

  // Appointments
  appointments: Appointment[]
  addAppointment: (appt: Omit<Appointment, "id" | "appointmentId" | "createdAt">) => Promise<Appointment>
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>
  getAvailableSlots: (doctorId: string, date: string) => string[]
  getAppointmentsForDoctor: (doctorId: string, date?: string) => Appointment[]
  getAppointmentsForPatient: (patientId: string) => Appointment[]

  // Consultations
  consultations: Consultation[]
  addConsultation: (cons: Omit<Consultation, "id" | "createdAt">) => Promise<Consultation>
  getConsultationsForPatient: (patientId: string) => Consultation[]
}

const StoreContext = createContext<StoreContextType | null>(null)

// Helper to normalize MongoDB _id to id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeId<T>(doc: any): T {
  if (doc && doc._id && !doc.id) {
    return { ...doc, id: String(doc._id) } as T
  }
  return doc as T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeDocs<T>(docs: any[] | undefined | null): T[] {
  if (!docs || !Array.isArray(docs)) return []
  return docs.map((d) => normalizeId<T>(d))
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])

  // Restore session from JWT cookie on load
  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        if (data.user) {
          setCurrentUser(normalizeId(data.user))
        }
      } catch { }
      finally {
        setIsLoading(false)
      }
    }
    restoreSession()
  }, [])

  // Load data when user is set
  useEffect(() => {
    if (!currentUser) {
      setPatients([])
      setAppointments([])
      setConsultations([])
      setUsers([])
      return
    }

    async function loadData() {
      try {
        const [pRes, aRes, cRes, dRes] = await Promise.all([
          fetch("/api/patients"),
          fetch("/api/appointments"),
          fetch("/api/consultations"),
          fetch("/api/doctors"),
        ])
        const [pData, aData, cData, dData] = await Promise.all([
          pRes.json(), aRes.json(), cRes.json(), dRes.json(),
        ])
        if (pData.patients) setPatients(normalizeDocs(pData.patients))
        if (aData.appointments) setAppointments(normalizeDocs(aData.appointments))
        if (cData.consultations) setConsultations(normalizeDocs(cData.consultations))
        if (dData.doctors) setUsers(normalizeDocs(dData.doctors))
      } catch (e) {
        console.error("Failed to load data", e)
      }
    }

    loadData()
  }, [currentUser])

  const login = useCallback(async (email: string, password: string): Promise<{ user?: User; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { error: data.error || "Invalid email or password" }
      const user = normalizeId(data.user) as User
      setCurrentUser(user)
      return { user }
    } catch {
      return { error: "Network error. Please try again." }
    }
  }, [])

  const register = useCallback(async (formData: {
    name: string; email: string; password: string; mobile: string;
    age: number; gender: "male" | "female" | "other"; address?: string
  }): Promise<{ user?: User; error?: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) return { error: data.error || "Registration failed" }
      const user = normalizeId(data.user) as User
      setCurrentUser(user)
      return { user }
    } catch {
      return { error: "Network error. Please try again." }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch { }
    setCurrentUser(null)
  }, [])

  const getDoctors = useCallback((): User[] => {
    // Build doctors list from current user if they are a doctor
    // and from any known data
    return users.filter((u) => u.role === "doctor")
  }, [users])

  const addPatient = useCallback(async (data: Omit<Patient, "id" | "patientId" | "registrationDate">): Promise<Patient> => {
    const res = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    const patient = normalizeId(result.patient) as Patient
    setPatients((prev) => [...prev, patient])
    return patient
  }, [])

  const updatePatient = useCallback(async (id: string, data: Partial<Patient>) => {
    const res = await fetch("/api/patients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    })
    const result = await res.json()
    const updated = normalizeId(result.patient) as Patient
    setPatients((prev) => prev.map((p) => (p.id === id ? updated : p)))
  }, [])

  const getPatientById = useCallback((id: string) => {
    return patients.find((p) => p.id === id)
  }, [patients])

  const searchPatients = useCallback((query: string): Patient[] => {
    const q = query.toLowerCase()
    return patients.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.mobile.includes(q) ||
      p.patientId.toLowerCase().includes(q)
    )
  }, [patients])

  const addAppointment = useCallback(async (data: Omit<Appointment, "id" | "appointmentId" | "createdAt">): Promise<Appointment> => {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    const appt = normalizeId(result.appointment) as Appointment
    setAppointments((prev) => [...prev, appt])
    return appt
  }, [])

  const updateAppointmentStatus = useCallback(async (id: string, status: AppointmentStatus) => {
    await fetch(`/api/appointments/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }, [])

  const getAvailableSlots = useCallback((doctorId: string, date: string): string[] => {
    const booked = appointments
      .filter((a) => a.doctorId === doctorId && a.date === date && a.status !== "cancelled")
      .map((a) => a.timeSlot)
    return TIME_SLOTS.filter((s) => !booked.includes(s))
  }, [appointments])

  const getAppointmentsForDoctor = useCallback((doctorId: string, date?: string) => {
    return appointments.filter((a) => a.doctorId === doctorId && (!date || a.date === date))
  }, [appointments])

  const getAppointmentsForPatient = useCallback((patientId: string) => {
    return appointments.filter((a) => a.patientId === patientId)
  }, [appointments])

  const addConsultation = useCallback(async (data: Omit<Consultation, "id" | "createdAt">): Promise<Consultation> => {
    const res = await fetch("/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    const cons = normalizeId(result.consultation) as Consultation
    setConsultations((prev) => [...prev, cons])
    return cons
  }, [])

  const getConsultationsForPatient = useCallback((patientId: string) => {
    return consultations.filter((c) => c.patientId === patientId)
  }, [consultations])

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        register,
        logout,
        users,
        getDoctors,
        patients,
        addPatient,
        updatePatient,
        getPatientById,
        searchPatients,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        getAvailableSlots,
        getAppointmentsForDoctor,
        getAppointmentsForPatient,
        consultations,
        addConsultation,
        getConsultationsForPatient,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
