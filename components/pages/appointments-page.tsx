"use client"

import React, { useState, useRef } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarPlus, AlertCircle, Upload, X, FileText, File, ShieldAlert, Download } from "lucide-react"
import type { AppointmentStatus, UploadedFile } from "@/lib/types"

const ACCEPTED_FILE_TYPES = ".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.txt"
const MAX_FILE_SIZE_MB = 5

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(type: string) {
  if (type.includes("pdf")) return <FileText className="size-4 text-red-500" />
  if (type.includes("presentation") || type.includes("ppt")) return <File className="size-4 text-orange-500" />
  if (type.includes("word") || type.includes("doc")) return <File className="size-4 text-blue-500" />
  if (type.includes("image")) return <File className="size-4 text-emerald-500" />
  return <File className="size-4 text-muted-foreground" />
}

export function AppointmentsPage() {
  const {
    currentUser,
    patients,
    appointments,
    getDoctors,
    addAppointment,
    updateAppointmentStatus,
    getAvailableSlots,
  } = useStore()

  const [showBookDialog, setShowBookDialog] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [optionalRecordData, setOptionalRecordData] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [bookingError, setBookingError] = useState("")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const doctors = getDoctors()
  const isDoctor = currentUser?.role === "doctor"
  const isPatient = currentUser?.role === "patient"
  const canBook = currentUser?.role === "admin" || currentUser?.role === "receptionist"
  const canUpdateStatus = currentUser?.role !== "patient"
  const canViewHealthData = currentUser?.role === "doctor"

  const availableSlots =
    selectedDoctor && selectedDate
      ? getAvailableSlots(selectedDoctor, selectedDate)
      : []

  const filteredAppointments = appointments.filter((a) => {
    if (isDoctor && a.doctorId !== currentUser?.id) return false
    if (isPatient) {
      const myPatient = patients.find((p) => p.userId === currentUser?.id)
      if (!myPatient || a.patientId !== myPatient.id) return false
    }
    if (filterStatus !== "all" && a.status !== filterStatus) return false
    return true
  })

  const sortedAppointments = [...filteredAppointments].sort(
    (a, b) => b.date.localeCompare(a.date) || a.timeSlot.localeCompare(b.timeSlot)
  )

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("")
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles: UploadedFile[] = []
    let errorMsg = ""
    let processed = 0

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errorMsg = `"${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit.`
        processed++
        if (processed === files.length && newFiles.length > 0) {
          setUploadedFiles((prev) => [...prev, ...newFiles])
        }
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        newFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: reader.result as string,
        })
        processed++
        if (processed === files.length) {
          setUploadedFiles((prev) => [...prev, ...newFiles])
          if (errorMsg) setUploadError(errorMsg)
        }
      }
      reader.onerror = () => {
        errorMsg = `Failed to read "${file.name}".`
        processed++
        if (processed === files.length && newFiles.length > 0) {
          setUploadedFiles((prev) => [...prev, ...newFiles])
        }
      }
      reader.readAsDataURL(file)
    })

    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleBook = () => {
    setBookingError("")

    let patientId = selectedPatient
    const doctorId = selectedDoctor

    if (isPatient) {
      const myPatient = patients.find((p) => p.userId === currentUser?.id)
      if (!myPatient) {
        setBookingError("Your patient profile was not found.")
        return
      }
      patientId = myPatient.id
    }

    if (!patientId || !doctorId || !selectedDate || !selectedSlot) {
      setBookingError("Please fill in all fields.")
      return
    }

    const slots = getAvailableSlots(doctorId, selectedDate)
    if (!slots.includes(selectedSlot)) {
      setBookingError("This slot is no longer available. Please choose another.")
      return
    }

    addAppointment({
      patientId,
      doctorId,
      date: selectedDate,
      timeSlot: selectedSlot,
      status: "waiting",
      uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      optionalRecordData: optionalRecordData.trim() || undefined,
    })

    resetBookingForm()
    setShowBookDialog(false)
  }

  const resetBookingForm = () => {
    setSelectedPatient("")
    setSelectedDoctor("")
    setSelectedDate("")
    setSelectedSlot("")
    setUploadedFiles([])
    setOptionalRecordData("")
    setBookingError("")
    setUploadError("")
  }

  const downloadFile = (file: UploadedFile) => {
    const link = document.createElement("a")
    link.href = file.dataUrl
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isDoctor
              ? "Your scheduled appointments"
              : isPatient
                ? "Your appointments"
                : "Manage all clinic appointments"}
          </p>
        </div>
        {(canBook || isPatient) && (
          <Dialog open={showBookDialog} onOpenChange={(open) => { setShowBookDialog(open); if (!open) resetBookingForm() }}>
            <DialogTrigger asChild>
              <Button>
                <CalendarPlus className="size-4 mr-2" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Book Appointment</DialogTitle>
                <DialogDescription>
                  Schedule a new appointment at the clinic
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                {bookingError && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
                    <AlertCircle className="size-4 shrink-0" />
                    {bookingError}
                  </div>
                )}

                {!isPatient && (
                  <div className="flex flex-col gap-2">
                    <Label>Patient</Label>
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} ({p.patientId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Label>Doctor</Label>
                  <Select value={selectedDoctor} onValueChange={(val) => { setSelectedDoctor(val); setSelectedSlot("") }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name} ({d.specialization || "General"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot("") }}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {selectedDoctor && selectedDate && (
                  <div className="flex flex-col gap-2">
                    <Label>Available Time Slots</Label>
                    {availableSlots.length === 0 ? (
                      <p className="text-sm text-muted-foreground p-3 border rounded-lg text-center">
                        No available slots for this date.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => (
                          <Button
                            key={slot}
                            variant={selectedSlot === slot ? "default" : "outline"}
                            size="sm"
                            className="text-xs"
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Upload Previous Health Records */}
                <div className="flex flex-col gap-3 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Upload className="size-4 text-primary" />
                    <Label className="font-semibold">Upload Previous Health Records</Label>
                    <span className="text-xs text-muted-foreground">(Optional)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload PDFs, PPTs, images, or documents of your previous health records, lab reports, or prescriptions. Max {MAX_FILE_SIZE_MB}MB per file. Accessible only to the doctor.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_FILE_TYPES}
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="health-record-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="size-4" />
                    Choose Files
                  </Button>

                  {uploadError && (
                    <p className="text-xs text-red-600 dark:text-red-400">{uploadError}</p>
                  )}

                  {uploadedFiles.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center gap-3 rounded-lg border bg-muted/50 px-3 py-2"
                        >
                          {getFileIcon(file.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="size-7 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFile(index)}
                          >
                            <X className="size-3.5" />
                            <span className="sr-only">Remove file</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Optional text notes */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="size-4 text-primary" />
                    <Label className="font-semibold">Additional Notes (Optional)</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Describe allergies, ongoing medications, or anything else. Doctor-only access.
                  </p>
                  <Textarea
                    value={optionalRecordData}
                    onChange={(e) => setOptionalRecordData(e.target.value)}
                    placeholder="e.g., Allergic to penicillin, Diabetes since 2020, currently on Metformin 500mg..."
                    rows={3}
                  />
                </div>

                <Button onClick={handleBook} disabled={!selectedSlot}>
                  Confirm Booking
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Appointment List</CardTitle>
              <CardDescription>
                {sortedAppointments.length} appointment{sortedAppointments.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  {canViewHealthData && <TableHead>Records</TableHead>}
                  {canUpdateStatus && <TableHead>Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canUpdateStatus ? (canViewHealthData ? 8 : 7) : 6} className="text-center py-8 text-muted-foreground">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedAppointments.map((appt) => {
                    const patient = patients.find((p) => p.id === appt.patientId)
                    const doctor = doctors.find((d) => d.id === appt.doctorId)
                    const hasHealthData = (appt.uploadedFiles && appt.uploadedFiles.length > 0) || appt.optionalRecordData
                    const isExpanded = expandedRow === appt.id
                    return (
                      <React.Fragment key={appt.id}>
                        <TableRow className={isExpanded ? "border-b-0" : ""}>
                          <TableCell className="font-mono text-xs">{appt.appointmentId}</TableCell>
                          <TableCell className="font-medium">{patient?.name || "Unknown"}</TableCell>
                          <TableCell>{doctor?.name || "Unknown"}</TableCell>
                          <TableCell>{appt.date}</TableCell>
                          <TableCell className="font-mono text-sm">{appt.timeSlot}</TableCell>
                          <TableCell><StatusBadge status={appt.status} /></TableCell>
                          {canViewHealthData && (
                            <TableCell>
                              {hasHealthData ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1.5 text-xs text-primary hover:text-primary"
                                  onClick={() => setExpandedRow(isExpanded ? null : appt.id)}
                                >
                                  <FileText className="size-3.5" />
                                  {isExpanded ? "Hide" : "View"}
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">--</span>
                              )}
                            </TableCell>
                          )}
                          {canUpdateStatus && (
                            <TableCell>
                              {appt.status !== "completed" && appt.status !== "cancelled" && (
                                <Select
                                  value={appt.status}
                                  onValueChange={(val) =>
                                    updateAppointmentStatus(appt.id, val as AppointmentStatus)
                                  }
                                >
                                  <SelectTrigger className="w-[130px] h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="waiting">Waiting</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                        {/* Expanded health data row - DOCTOR ONLY */}
                        {canViewHealthData && isExpanded && hasHealthData && (
                          <TableRow className="bg-primary/5 hover:bg-primary/5">
                            <TableCell colSpan={canUpdateStatus ? 8 : 7} className="p-4">
                              <div className="flex flex-col gap-4 rounded-lg border border-primary/20 bg-background p-4">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                                  <ShieldAlert className="size-3.5" />
                                  Confidential Patient Health Data
                                </div>

                                {/* Uploaded files */}
                                {appt.uploadedFiles && appt.uploadedFiles.length > 0 && (
                                  <div className="flex flex-col gap-2">
                                    <p className="text-xs font-medium text-muted-foreground">Uploaded Health Records</p>
                                    <div className="flex flex-col gap-2">
                                      {appt.uploadedFiles.map((file, idx) => (
                                        <div
                                          key={`${file.name}-${idx}`}
                                          className="flex items-center gap-3 rounded-lg border bg-muted/50 px-3 py-2"
                                        >
                                          {getFileIcon(file.type)}
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                          </div>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-1.5 text-xs"
                                            onClick={() => downloadFile(file)}
                                          >
                                            <Download className="size-3.5" />
                                            Download
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Text notes */}
                                {appt.optionalRecordData && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Additional Notes</p>
                                    <p className="text-sm whitespace-pre-line">{appt.optionalRecordData}</p>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
