"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Heart, Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

function ResetPasswordFormContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setStatus({ type: "error", message: "Passwords do not match" })
            return
        }

        if (password.length < 6) {
            setStatus({ type: "error", message: "Password must be at least 6 characters" })
            return
        }

        setIsLoading(true)
        setStatus(null)

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
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

    if (!token) {
        return (
            <div className="text-center space-y-4">
                <AlertCircle className="size-12 text-red-500 mx-auto" />
                <h2 className="text-xl font-bold">Invalid Reset Link</h2>
                <p className="text-muted-foreground">The password reset link is missing or invalid. Please request a new one.</p>
                <Button asChild className="w-full h-11">
                    <Link href="/auth/retrieve">Request New Link</Link>
                </Button>
            </div>
        )
    }

    if (status?.type === "success") {
        return (
            <div className="text-center space-y-6">
                <CheckCircle2 className="size-12 text-emerald-500 mx-auto" />
                <h2 className="text-2xl font-bold text-foreground">Password Reset Complete</h2>
                <p className="text-muted-foreground">Your password has been successfully updated. You can now log in with your new credentials.</p>
                <Button asChild className="w-full h-11 font-semibold group text-base">
                    <Link href="/">
                        Go to Sign In
                        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Set New Password</h2>
                <p className="text-muted-foreground text-sm">Create a strong password to protect your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {status?.type === "error" && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                        <AlertCircle className="size-4 shrink-0" />
                        {status.message}
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-11 shadow-sm"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-11 shadow-sm"
                    />
                </div>

                <div className="pt-2">
                    <Button type="submit" className="w-full h-12 font-bold text-lg shadow-lg" disabled={isLoading}>
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export function ResetPasswordForm() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 lg:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center gap-3 mb-10">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/20">
                        <Lock className="size-7 text-primary-foreground" />
                    </div>
                </div>

                <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
                    <ResetPasswordFormContent />
                </Suspense>

                <div className="mt-10 text-center">
                    <Link
                        href="/"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:underline"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
