export type UserRole = "admin" | "doctor" | "receptionist" | "patient"

export type AppointmentStatus =
  | "waiting"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  mobile?: string
  specialization?: string
}

export interface Patient {
  id: string
  patientId: string
  name: string
  age: number
  gender: "male" | "female" | "other"
  mobile: string
  address: string
  registrationDate: string
  userId?: string
}

export interface Appointment {
  id: string
  appointmentId: string
  patientId: string
  doctorId: string
  date: string
  timeSlot: string
  status: AppointmentStatus
  createdAt: string
  /** Uploaded health record files - PDFs, PPTs, images (doctor-only access) */
  uploadedFiles?: UploadedFile[]
  /** Optional text notes about health history (doctor-only access) */
  optionalRecordData?: string
}

export interface UploadedFile {
  name: string
  size: number
  type: string
  dataUrl: string
}

export interface Consultation {
  id: string
  appointmentId: string
  patientId: string
  doctorId: string
  symptoms: string
  diagnosis: string
  prescription: string
  followUpDate?: string
  notes: string
  createdAt: string
}

export const TIME_SLOTS = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
]

export const STATUS_COLORS: Record<AppointmentStatus, string> = {
  waiting: "bg-orange-100 text-orange-700 border-orange-200",
  confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
}

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  waiting: "Waiting",
  confirmed: "Confirmed",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}
