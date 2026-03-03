"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Mail, Phone, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

export function AuthRetrievalForm() {
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
    const [foundEmail, setFoundEmail] = useState<string | null>(null)

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setStatus(null)
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (res.ok) {
                setStatus({ type: "success", message: data.message })
            } else {
                setStatus({ type: "error", message: data.error || "Something went wrong" })
            }
        } catch (e) {
            setStatus({ type: "error", message: "Network error. Please try again." })
        } finally {
            setIsLoading(false)
        }
    }

    const handleFindAccount = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setStatus(null)
        setFoundEmail(null)
        try {
            const res = await fetch("/api/auth/retrieve-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile }),
            })
            const data = await res.json()
            if (res.ok) {
                setFoundEmail(data.email)
                setStatus({ type: "success", message: `Account found for ${data.name}.` })
            } else {
                setStatus({ type: "error", message: data.error || "No account found" })
            }
        } catch (e) {
            setStatus({ type: "error", message: "Network error. Please try again." })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 lg:p-10">
            <div className="w-full max-w-sm">
                <Link
                    href="/"
                    className="mb-8 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back to Sign In
                </Link>

                <div className="flex flex-col items-center gap-2 mb-8">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary">
                        <Heart className="size-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Account Access</h1>
                    <p className="text-muted-foreground text-sm text-center">Retrieve your account or reset your password</p>
                </div>

                <Tabs defaultValue="forgot" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="forgot">Forgot Password</TabsTrigger>
                        <TabsTrigger value="find">Find Account</TabsTrigger>
                    </TabsList>

                    <TabsContent value="forgot">
                        <Card className="border-none shadow-none bg-transparent">
                            <CardHeader className="px-0 pt-0">
                                <CardTitle className="text-xl">Forgot Password?</CardTitle>
                                <CardDescription>
                                    Enter your email and we'll send you a link to reset your password.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-0 pb-0">
                                <form onSubmit={handleForgotPassword} className="space-y-4">
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
                                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                                        {isLoading ? "Sending..." : "Send Reset Link"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="find">
                        <Card className="border-none shadow-none bg-transparent">
                            <CardHeader className="px-0 pt-0">
                                <CardTitle className="text-xl">Find Your Account</CardTitle>
                                <CardDescription>
                                    Forgotten your email? Enter the mobile number used when creating your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-0 pb-0">
                                <form onSubmit={handleFindAccount} className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="mobile">Mobile Number</Label>
                                        <Input
                                            id="mobile"
                                            type="tel"
                                            placeholder="10 digit mobile number"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            required
                                            className="h-11"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                                        {isLoading ? "Searching..." : "Find My Account"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {status && (
                    <div className={`mt-6 flex items-start gap-2 rounded-lg p-3 text-sm border ${status.type === "success"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-red-50 border-red-200 text-red-700"
                        }`}>
                        {status.type === "success" ? <CheckCircle2 className="size-4 shrink-0 mt-0.5" /> : <AlertCircle className="size-4 shrink-0 mt-0.5" />}
                        <div className="flex flex-col gap-1">
                            <p>{status.message}</p>
                            {status.type === "success" && foundEmail && (
                                <div className="mt-2 text-foreground font-medium">
                                    Your email address is: <span className="select-all underline decoration-emerald-500/30">{foundEmail}</span>
                                    <div className="mt-2">
                                        <Button asChild variant="link" size="sm" className="h-auto p-0 text-emerald-700">
                                            <Link href="#" onClick={() => {
                                                setEmail(foundEmail);
                                                // Switch to forgot tab? That might be too complex for now
                                            }}>
                                                Use this email to reset password
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
