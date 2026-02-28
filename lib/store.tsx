"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import {
  TIME_SLOTS,
  type User,
  type Patient,
  type Appointment,
  type Consultation,
  type AppointmentStatus,
  type UserRole,
} from "./types"

// Seed data
const seedUsers: User[] = [
  {
    id: "u1",
    name: "Dr. Sree Ram (Admin)",
    email: "admin@clinic.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "u2",
    name: "Dr. Sree Ram",
    email: "doctor@clinic.com",
    password: "doctor123",
    role: "doctor",
    specialization: "General Medicine",
  },
  {
    id: "u3",
    name: "Priya Sharma",
    email: "reception@clinic.com",
    password: "reception123",
    role: "receptionist",
    mobile: "9876543210",
  },
  {
    id: "u4",
    name: "Amit Patel",
    email: "patient@clinic.com",
    password: "patient123",
    role: "patient",
    mobile: "9123456780",
  },
]

const today = new Date().toISOString().split("T")[0]

const seedPatients: Patient[] = [
  {
    id: "p1",
    patientId: "PAT-001",
    name: "Amit Patel",
    age: 35,
    gender: "male",
    mobile: "9123456780",
    address: "12 MG Road, Mumbai",
    registrationDate: "2025-12-01",
    userId: "u4",
  },
  {
    id: "p2",
    patientId: "PAT-002",
    name: "Sunita Devi",
    age: 42,
    gender: "female",
    mobile: "9234567890",
    address: "45 Station Road, Delhi",
    registrationDate: "2025-12-05",
  },
  {
    id: "p3",
    patientId: "PAT-003",
    name: "Rahul Verma",
    age: 28,
    gender: "male",
    mobile: "9345678901",
    address: "78 Park Street, Kolkata",
    registrationDate: "2026-01-10",
  },
  {
    id: "p4",
    patientId: "PAT-004",
    name: "Meena Kumari",
    age: 55,
    gender: "female",
    mobile: "9456789012",
    address: "23 Lake View, Bangalore",
    registrationDate: "2026-01-15",
  },
  {
    id: "p5",
    patientId: "PAT-005",
    name: "Arjun Singh",
    age: 22,
    gender: "male",
    mobile: "9567890123",
    address: "56 Main Bazaar, Jaipur",
    registrationDate: "2026-02-01",
  },
]

const seedAppointments: Appointment[] = [
  {
    id: "a1",
    appointmentId: "APT-001",
    patientId: "p1",
    doctorId: "u2",
    date: today,
    timeSlot: "10:00 AM",
    status: "confirmed",
    createdAt: "2026-02-25",
  },
  {
    id: "a2",
    appointmentId: "APT-002",
    patientId: "p2",
    doctorId: "u2",
    date: today,
    timeSlot: "10:30 AM",
    status: "waiting",
    createdAt: "2026-02-25",
  },
  {
    id: "a3",
    appointmentId: "APT-003",
    patientId: "p3",
    doctorId: "u2",
    date: today,
    timeSlot: "11:00 AM",
    status: "in-progress",
    createdAt: "2026-02-26",
  },
  {
    id: "a4",
    appointmentId: "APT-004",
    patientId: "p4",
    doctorId: "u2",
    date: today,
    timeSlot: "02:00 PM",
    status: "waiting",
    createdAt: "2026-02-26",
  },
  {
    id: "a5",
    appointmentId: "APT-005",
    patientId: "p5",
    doctorId: "u2",
    date: "2026-02-20",
    timeSlot: "03:00 PM",
    status: "completed",
    createdAt: "2026-02-18",
  },
]

const seedConsultations: Consultation[] = [
  {
    id: "c1",
    appointmentId: "a5",
    patientId: "p5",
    doctorId: "u2",
    symptoms: "Fever, headache, body pain",
    diagnosis: "Viral fever",
    prescription: "Paracetamol 500mg - 3 times daily for 5 days\nRest advised",
    followUpDate: "2026-03-01",
    notes: "Patient responded well to initial treatment.",
    createdAt: "2026-02-20",
  },
]

interface StoreContextType {
  // Auth
  currentUser: User | null
  login: (email: string, password: string) => User | null
  register: (data: Omit<User, "id" | "role"> & { mobile: string }) => { user?: User; error?: string }
  logout: () => void

  // Users
  users: User[]
  getDoctors: () => User[]

  // Patients
  patients: Patient[]
  addPatient: (patient: Omit<Patient, "id" | "patientId" | "registrationDate">) => Patient
  updatePatient: (id: string, data: Partial<Patient>) => void
  getPatientById: (id: string) => Patient | undefined
  searchPatients: (query: string) => Patient[]

  // Appointments
  appointments: Appointment[]
  addAppointment: (appt: Omit<Appointment, "id" | "appointmentId" | "createdAt">) => Appointment
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void
  getAvailableSlots: (doctorId: string, date: string) => string[]
  getAppointmentsForDoctor: (doctorId: string, date?: string) => Appointment[]
  getAppointmentsForPatient: (patientId: string) => Appointment[]

  // Consultations
  consultations: Consultation[]
  addConsultation: (cons: Omit<Consultation, "id" | "createdAt">) => Consultation
  getConsultationsForPatient: (patientId: string) => Consultation[]
}

const StoreContext = createContext<StoreContextType | null>(null)

let patientCounter = 6
let appointmentCounter = 6
let consultationCounter = 2

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(seedUsers)
  const [patients, setPatients] = useState<Patient[]>(seedPatients)
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments)
  const [consultations, setConsultations] = useState<Consultation[]>(seedConsultations)

  const login = useCallback(
    (email: string, password: string): User | null => {
      const user = users.find((u) => u.email === email && u.password === password)
      if (user) {
        setCurrentUser(user)
        return user
      }
      return null
    },
    [users]
  )

  const register = useCallback(
    (data: Omit<User, "id" | "role"> & { mobile: string }): { user?: User; error?: string } => {
      // Check if email already exists
      if (users.some((u) => u.email === data.email)) {
        return { error: "An user with this email already exists" }
      }

      // Create standard user account
      const newUser: User = {
        ...data,
        id: `u${users.length + 1}`,
        role: "patient"
      }

      // Create corresponding patient profile
      const newPatient: Patient = {
        id: `p${patientCounter}`,
        patientId: `PAT-${String(patientCounter).padStart(3, "0")}`,
        name: data.name,
        mobile: data.mobile,
        // Default patient values since form doesn't capture these yet
        age: 0,
        gender: "other",
        address: "Not provided",
        registrationDate: new Date().toISOString().split("T")[0],
        userId: newUser.id
      }
      patientCounter++

      setUsers((prev) => [...prev, newUser])
      setPatients((prev) => [...prev, newPatient])
      setCurrentUser(newUser)
      
      return { user: newUser }
    },
    [users]
  )

  const logout = useCallback(() => setCurrentUser(null), [])

  const getDoctors = useCallback(
    () => users.filter((u) => u.role === "doctor"),
    [users]
  )

  const addPatient = useCallback(
    (data: Omit<Patient, "id" | "patientId" | "registrationDate">): Patient => {
      const newPatient: Patient = {
        ...data,
        id: `p${patientCounter}`,
        patientId: `PAT-${String(patientCounter).padStart(3, "0")}`,
        registrationDate: new Date().toISOString().split("T")[0],
      }
      patientCounter++
      setPatients((prev) => [...prev, newPatient])
      return newPatient
    },
    []
  )

  const updatePatient = useCallback((id: string, data: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    )
  }, [])

  const getPatientById = useCallback(
    (id: string) => patients.find((p) => p.id === id),
    [patients]
  )

  const searchPatients = useCallback(
    (query: string) => {
      const q = query.toLowerCase()
      return patients.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.mobile.includes(q) ||
          p.patientId.toLowerCase().includes(q)
      )
    },
    [patients]
  )

  const addAppointment = useCallback(
    (data: Omit<Appointment, "id" | "appointmentId" | "createdAt">): Appointment => {
      const newAppt: Appointment = {
        ...data,
        id: `a${appointmentCounter}`,
        appointmentId: `APT-${String(appointmentCounter).padStart(3, "0")}`,
        createdAt: new Date().toISOString().split("T")[0],
      }
      appointmentCounter++
      setAppointments((prev) => [...prev, newAppt])
      return newAppt
    },
    []
  )

  const updateAppointmentStatus = useCallback(
    (id: string, status: AppointmentStatus) => {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      )
    },
    []
  )

  const getAvailableSlots = useCallback(
    (doctorId: string, date: string) => {
      const booked = appointments
        .filter(
          (a) =>
            a.doctorId === doctorId &&
            a.date === date &&
            a.status !== "cancelled"
        )
        .map((a) => a.timeSlot)
      return TIME_SLOTS.filter((s) => !booked.includes(s))
    },
    [appointments]
  )

  const getAppointmentsForDoctor = useCallback(
    (doctorId: string, date?: string) => {
      return appointments.filter(
        (a) => a.doctorId === doctorId && (!date || a.date === date)
      )
    },
    [appointments]
  )

  const getAppointmentsForPatient = useCallback(
    (patientId: string) => {
      return appointments.filter((a) => a.patientId === patientId)
    },
    [appointments]
  )

  const addConsultation = useCallback(
    (data: Omit<Consultation, "id" | "createdAt">): Consultation => {
      const newCons: Consultation = {
        ...data,
        id: `c${consultationCounter}`,
        createdAt: new Date().toISOString().split("T")[0],
      }
      consultationCounter++
      setConsultations((prev) => [...prev, newCons])
      return newCons
    },
    []
  )

  const getConsultationsForPatient = useCallback(
    (patientId: string) => {
      return consultations.filter((c) => c.patientId === patientId)
    },
    [consultations]
  )

  return (
    <StoreContext.Provider
      value={{
        currentUser,
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
