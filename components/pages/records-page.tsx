"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Search, FilePlus, Calendar, Stethoscope, Pill, FileText, ShieldAlert, Download, File } from "lucide-react"
import type { Consultation, UploadedFile } from "@/lib/types"

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

function downloadFile(file: UploadedFile) {
  const link = document.createElement("a")
  link.href = file.dataUrl
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function RecordsPage() {
  const {
    currentUser,
    patients,
    appointments,
    consultations,
    getDoctors,
    addConsultation,
    updateAppointmentStatus,
  } = useStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("")
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [formData, setFormData] = useState({
    symptoms: "",
    diagnosis: "",
    prescription: "",
    followUpDate: "",
    notes: "",
  })

  const doctors = getDoctors()
  const isDoctor = currentUser?.role === "doctor"
  const isPatient = currentUser?.role === "patient"
  const canViewHealthData = currentUser?.role === "doctor"

  const completableAppointments = isDoctor
    ? appointments.filter(
        (a) =>
          a.doctorId === currentUser?.id &&
          (a.status === "in-progress" || a.status === "confirmed") &&
          !consultations.some((c) => c.appointmentId === a.id)
      )
    : []

  const filteredPatients = patients.filter((p) => {
    if (isPatient) {
      return p.userId === currentUser?.id
    }
    const q = searchQuery.toLowerCase()
    if (q && !p.name.toLowerCase().includes(q) && !p.patientId.toLowerCase().includes(q) && !p.mobile.includes(q)) {
      return false
    }
    return true
  })

  const handleAddConsultation = () => {
    if (
      !selectedPatientId ||
      !selectedAppointmentId ||
      !formData.symptoms ||
      !formData.diagnosis ||
      !currentUser
    )
      return

    addConsultation({
      appointmentId: selectedAppointmentId,
      patientId: selectedPatientId,
      doctorId: currentUser.id,
      symptoms: formData.symptoms,
      diagnosis: formData.diagnosis,
      prescription: formData.prescription,
      followUpDate: formData.followUpDate || undefined,
      notes: formData.notes,
    })

    updateAppointmentStatus(selectedAppointmentId, "completed")

    setFormData({ symptoms: "", diagnosis: "", prescription: "", followUpDate: "", notes: "" })
    setSelectedPatientId("")
    setSelectedAppointmentId("")
    setShowAddDialog(false)
  }

  const getPatientConsultations = (patientId: string): Consultation[] => {
    return consultations.filter((c) => c.patientId === patientId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  const getPatientHealthData = (patientId: string) => {
    return appointments
      .filter((a) => a.patientId === patientId && ((a.uploadedFiles && a.uploadedFiles.length > 0) || a.optionalRecordData))
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Health Records</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isPatient
              ? "Your consultation history and health records"
              : "Manage digital health records and consultation history"}
          </p>
        </div>
        {isDoctor && completableAppointments.length > 0 && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <FilePlus className="size-4 mr-2" />
                Add Consultation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Consultation Notes</DialogTitle>
                <DialogDescription>
                  Record consultation details for a patient
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Select Appointment</Label>
                  <Select
                    value={selectedAppointmentId}
                    onValueChange={(val) => {
                      setSelectedAppointmentId(val)
                      const appt = appointments.find((a) => a.id === val)
                      if (appt) setSelectedPatientId(appt.patientId)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an appointment" />
                    </SelectTrigger>
                    <SelectContent>
                      {completableAppointments.map((appt) => {
                        const patient = patients.find((p) => p.id === appt.patientId)
                        return (
                          <SelectItem key={appt.id} value={appt.id}>
                            {patient?.name} - {appt.date} {appt.timeSlot}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Show patient-submitted health data to help the doctor */}
                {selectedAppointmentId && (() => {
                  const appt = appointments.find((a) => a.id === selectedAppointmentId)
                  if (!appt) return null
                  const hasFiles = appt.uploadedFiles && appt.uploadedFiles.length > 0
                  const hasNotes = !!appt.optionalRecordData
                  if (!hasFiles && !hasNotes) return null
                  return (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        <ShieldAlert className="size-3.5" />
                        Patient-Submitted Health Data
                      </div>
                      {hasFiles && (
                        <div className="flex flex-col gap-2">
                          <p className="text-xs font-medium text-muted-foreground">Uploaded Files</p>
                          {appt.uploadedFiles!.map((file, idx) => (
                            <div
                              key={`${file.name}-${idx}`}
                              className="flex items-center gap-3 rounded-md border bg-background px-3 py-2"
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
                                <Download className="size-3" />
                                Open
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      {hasNotes && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Additional Notes</p>
                          <p className="text-sm whitespace-pre-line">{appt.optionalRecordData}</p>
                        </div>
                      )}
                    </div>
                  )
                })()}

                <div className="flex flex-col gap-2">
                  <Label>Symptoms</Label>
                  <Textarea
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    placeholder="Describe patient symptoms"
                    rows={2}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Diagnosis</Label>
                  <Textarea
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    placeholder="Enter diagnosis"
                    rows={2}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Prescription</Label>
                  <Textarea
                    value={formData.prescription}
                    onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                    placeholder="Medications and dosage instructions"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Follow-up Date</Label>
                  <Input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes"
                    rows={2}
                  />
                </div>

                <Button onClick={handleAddConsultation}>Save Consultation</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!isPatient && (
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      <div className="flex flex-col gap-4">
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No patient records found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredPatients.map((patient) => {
            const patientConsultations = getPatientConsultations(patient.id)
            const patientHealthData = canViewHealthData ? getPatientHealthData(patient.id) : []
            const patientAppointments = appointments.filter(
              (a) => a.patientId === patient.id
            )
            const totalVisits = patientAppointments.filter(
              (a) => a.status === "completed"
            ).length

            return (
              <Card key={patient.id}>
                <CardHeader>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <CardDescription>
                        {patient.patientId} | Age: {patient.age} | {patient.gender} | Total Visits: {totalVisits}
                      </CardDescription>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full w-fit">
                      {patientConsultations.length} record{patientConsultations.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Doctor-only: Patient-submitted health data section */}
                  {canViewHealthData && patientHealthData.length > 0 && (
                    <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                        <ShieldAlert className="size-3.5" />
                        Patient-Submitted Health Data (Doctor Only)
                      </div>
                      <div className="flex flex-col gap-3">
                        {patientHealthData.map((appt) => (
                          <div key={appt.id} className="rounded-md border bg-background p-3 flex flex-col gap-2">
                            <p className="text-xs text-muted-foreground font-medium">
                              From appointment on {appt.date} ({appt.appointmentId})
                            </p>

                            {/* Uploaded files with download */}
                            {appt.uploadedFiles && appt.uploadedFiles.length > 0 && (
                              <div className="flex flex-col gap-1.5">
                                <p className="text-xs font-semibold text-foreground">Uploaded Files:</p>
                                {appt.uploadedFiles.map((file, idx) => (
                                  <div
                                    key={`${file.name}-${idx}`}
                                    className="flex items-center gap-3 rounded-md border bg-muted/50 px-3 py-1.5"
                                  >
                                    {getFileIcon(file.type)}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{file.name}</p>
                                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="gap-1.5 text-xs h-7"
                                      onClick={() => downloadFile(file)}
                                    >
                                      <Download className="size-3" />
                                      Download
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {appt.optionalRecordData && (
                              <div>
                                <p className="text-xs font-semibold text-foreground">Additional Notes:</p>
                                <p className="text-sm whitespace-pre-line">{appt.optionalRecordData}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {patientConsultations.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No consultation records yet.
                    </p>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {patientConsultations.map((cons) => {
                        const doctor = doctors.find((d) => d.id === cons.doctorId)
                        return (
                          <AccordionItem key={cons.id} value={cons.id}>
                            <AccordionTrigger className="text-sm">
                              <div className="flex items-center gap-3 text-left">
                                <Calendar className="size-4 text-muted-foreground shrink-0" />
                                <span>
                                  {cons.createdAt} - {cons.diagnosis}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid gap-4 pl-7">
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div className="flex items-start gap-2">
                                    <Stethoscope className="size-4 text-primary mt-0.5 shrink-0" />
                                    <div>
                                      <p className="text-xs font-medium text-muted-foreground">Doctor</p>
                                      <p className="text-sm">{doctor?.name || "Unknown"}</p>
                                    </div>
                                  </div>
                                  {cons.followUpDate && (
                                    <div className="flex items-start gap-2">
                                      <Calendar className="size-4 text-primary mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground">Follow-up</p>
                                        <p className="text-sm">{cons.followUpDate}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-start gap-2">
                                  <FileText className="size-4 text-orange-500 mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Symptoms</p>
                                    <p className="text-sm">{cons.symptoms}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-2">
                                  <Stethoscope className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Diagnosis</p>
                                    <p className="text-sm">{cons.diagnosis}</p>
                                  </div>
                                </div>

                                {cons.prescription && (
                                  <div className="flex items-start gap-2">
                                    <Pill className="size-4 text-blue-500 mt-0.5 shrink-0" />
                                    <div>
                                      <p className="text-xs font-medium text-muted-foreground">Prescription</p>
                                      <p className="text-sm whitespace-pre-line">{cons.prescription}</p>
                                    </div>
                                  </div>
                                )}

                                {cons.notes && (
                                  <div className="flex items-start gap-2">
                                    <FileText className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                      <p className="text-xs font-medium text-muted-foreground">Notes</p>
                                      <p className="text-sm">{cons.notes}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      })}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
