"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Heart, AlertCircle, ArrowLeft, ShieldCheck, Clock, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function RegisterForm() {
    const { register } = useStore()
    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [mobile, setMobile] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState<"male" | "female" | "other">("male")
    const [address, setAddress] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        if (!age || isNaN(parseInt(age)) || parseInt(age) <= 0) {
            setError("Please enter a valid age")
            return
        }

        setIsLoading(true)
        const { user, error: registerError } = await register({
            name,
            email,
            password,
            mobile,
            age: parseInt(age),
            gender,
            address,
        })
        setIsLoading(false)

        if (registerError) {
            setError(registerError)
        } else if (user) {
            // Successfully registered and logged in, redirect to dashboard
            router.push("/")
        } else {
            setError("Something went wrong during registration")
        }
    }

    return (
        <div className="flex min-h-svh">
            {/* Left panel - branding & illustration */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-10 text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 -left-10 size-72 rounded-full bg-primary-foreground/20 blur-3xl" />
                    <div className="absolute bottom-20 right-10 size-96 rounded-full bg-primary-foreground/10 blur-3xl" />
                </div>

                <div className="relative z-10">
                    <Link
                        href="/"
                        className="mb-8 flex items-center gap-1.5 text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground w-fit"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
                            <Heart className="size-6 text-primary-foreground" />
                        </div>
                        <div>
                            <span className="text-xl font-bold">Sri Ram RMP Clinic</span>
                            <p className="text-primary-foreground/60 text-xs">Digital Health Records System</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col gap-8">
                    <h2 className="text-3xl font-bold leading-tight text-balance">
                        Create your patient account
                    </h2>
                    <div className="flex flex-col gap-4">
                        {[
                            { icon: FileText, text: "Access your digital health records" },
                            { icon: Clock, text: "Book and track appointments easily" },
                            { icon: ShieldCheck, text: "Secure and private information" },
                        ].map((item) => (
                            <div key={item.text} className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15">
                                    <item.icon className="size-4 text-primary-foreground" />
                                </div>
                                <span className="text-sm text-primary-foreground/80">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-xs text-primary-foreground/40">
                    Trusted by local clinics for everyday healthcare
                </p>
            </div>

            {/* Right panel - register form */}
            <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 lg:p-10 overflow-y-auto">
                <div className="w-full max-w-sm py-8">
                    {/* Mobile back button */}
                    <Link
                        href="/"
                        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:hidden w-fit"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Home
                    </Link>

                    {/* Mobile logo */}
                    <div className="flex flex-col items-center gap-2 mb-8 lg:hidden">
                        <div className="flex items-center gap-2">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
                                <Heart className="size-5 text-primary-foreground" />
                            </div>
                            <span className="text-2xl font-bold text-foreground">Sri Ram RMP</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
                        <p className="text-muted-foreground text-sm mt-1">Sign up as a new patient to book appointments and track your health records</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                                <AlertCircle className="size-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Personal Info */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Ravi Kumar"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    min="1"
                                    max="120"
                                    placeholder="e.g. 35"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={gender} onValueChange={(v) => setGender(v as "male" | "female" | "other")}>
                                    <SelectTrigger id="gender" className="h-11">
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
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Input
                                id="mobile"
                                type="tel"
                                placeholder="10 digit number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="address">Address <span className="text-muted-foreground font-normal text-xs">(optional)</span></Label>
                            <Textarea
                                id="address"
                                placeholder="Your home address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={2}
                                className="resize-none"
                            />
                        </div>

                        {/* Account Credentials */}
                        <div className="border-t pt-4 mt-1 flex flex-col gap-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Login Credentials</p>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="At least 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11 mt-1 font-semibold" disabled={isLoading}>
                            {isLoading ? "Creating Account..." : "Create Account & Sign In"}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground mt-2">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-primary hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
