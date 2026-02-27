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
import { Search, UserPlus, Eye, Edit } from "lucide-react"
import type { Patient } from "@/lib/types"

export function PatientsPage() {
  const { patients, addPatient, updatePatient, searchPatients, currentUser } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "male" as "male" | "female" | "other",
    mobile: "",
    address: "",
  })

  const filteredPatients = searchQuery
    ? searchPatients(searchQuery)
    : patients

  const resetForm = () => {
    setFormData({ name: "", age: "", gender: "male", mobile: "", address: "" })
  }

  const handleAdd = () => {
    if (!formData.name || !formData.age || !formData.mobile) return
    addPatient({
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      mobile: formData.mobile,
      address: formData.address,
    })
    resetForm()
    setShowAddDialog(false)
  }

  const handleEdit = () => {
    if (!selectedPatient) return
    updatePatient(selectedPatient.id, {
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      mobile: formData.mobile,
      address: formData.address,
    })
    setShowEditDialog(false)
    setSelectedPatient(null)
  }

  const canManagePatients =
    currentUser?.role === "admin" ||
    currentUser?.role === "receptionist" ||
    currentUser?.role === "doctor"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage patient records and registrations
          </p>
        </div>
        {canManagePatients && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <UserPlus className="size-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New Patient</DialogTitle>
                <DialogDescription>
                  Fill in the patient details below.
                </DialogDescription>
              </DialogHeader>
              <PatientForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleAdd}
                submitLabel="Register Patient"
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Patient Directory</CardTitle>
              <CardDescription>
                {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, mobile, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Age</TableHead>
                  <TableHead className="hidden sm:table-cell">Gender</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead className="hidden md:table-cell">Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No patients found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-mono text-xs">{patient.patientId}</TableCell>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{patient.age}</TableCell>
                      <TableCell className="hidden sm:table-cell capitalize">{patient.gender}</TableCell>
                      <TableCell>{patient.mobile}</TableCell>
                      <TableCell className="hidden md:table-cell">{patient.registrationDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => {
                              setSelectedPatient(patient)
                              setShowViewDialog(true)
                            }}
                            aria-label="View patient"
                          >
                            <Eye className="size-4" />
                          </Button>
                          {canManagePatients && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() => {
                                setSelectedPatient(patient)
                                setFormData({
                                  name: patient.name,
                                  age: String(patient.age),
                                  gender: patient.gender,
                                  mobile: patient.mobile,
                                  address: patient.address,
                                })
                                setShowEditDialog(true)
                              }}
                              aria-label="Edit patient"
                            >
                              <Edit className="size-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient Profile</DialogTitle>
            <DialogDescription>Patient details and information</DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Patient ID</p>
                <p className="font-medium font-mono">{selectedPatient.patientId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{selectedPatient.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Age</p>
                <p className="font-medium">{selectedPatient.age} years</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gender</p>
                <p className="font-medium capitalize">{selectedPatient.gender}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Mobile</p>
                <p className="font-medium">{selectedPatient.mobile}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Registered</p>
                <p className="font-medium">{selectedPatient.registrationDate}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">{selectedPatient.address || "Not provided"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
            <DialogDescription>Update patient information</DialogDescription>
          </DialogHeader>
          <PatientForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEdit}
            submitLabel="Update Patient"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PatientForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel,
}: {
  formData: {
    name: string
    age: string
    gender: "male" | "female" | "other"
    mobile: string
    address: string
  }
  setFormData: (data: typeof formData) => void
  onSubmit: () => void
  submitLabel: string
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="pname">Full Name</Label>
        <Input
          id="pname"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter patient name"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="page">Age</Label>
          <Input
            id="page"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            placeholder="Age"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="pgender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(val) =>
              setFormData({ ...formData, gender: val as "male" | "female" | "other" })
            }
          >
            <SelectTrigger id="pgender">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="pmobile">Mobile Number</Label>
        <Input
          id="pmobile"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          placeholder="Enter mobile number"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="paddress">Address</Label>
        <Textarea
          id="paddress"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Enter address"
          rows={2}
        />
      </div>
      <Button onClick={onSubmit}>{submitLabel}</Button>
    </div>
  )
}
