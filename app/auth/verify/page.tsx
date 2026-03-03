"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

function VerifyContent() {
    const searchParams = useSearchParams()
    const status = searchParams.get("status")

    const isSuccess = status === "success"

    return (
        <div className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
            <Card className="w-full max-w-md border-none shadow-xl">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        {isSuccess ? (
                            <div className="rounded-full bg-emerald-100 p-3">
                                <CheckCircle2 className="size-10 text-emerald-600" />
                            </div>
                        ) : (
                            <div className="rounded-full bg-red-100 p-3">
                                <XCircle className="size-10 text-red-600" />
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {isSuccess ? "Email Verified!" : "Verification Failed"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <p className="text-muted-foreground text-balance">
                        {isSuccess
                            ? "Your email has been successfully verified. You can now access all features of the Sri Ram RMP Clinic portal."
                            : "We couldn't verify your email. The link may have expired or is invalid."}
                    </p>

                    <div className="pt-2">
                        {isSuccess ? (
                            <Button asChild className="w-full h-11 font-semibold group">
                                <Link href="/">
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        ) : (
                            <div className="space-y-3">
                                <Button asChild variant="outline" className="w-full h-11">
                                    <Link href="/">Back to Home</Link>
                                </Button>
                                <p className="text-xs text-muted-foreground mt-4">
                                    Need help? <Link href="#" className="underline">Contact support</Link>
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-svh items-center justify-center">
                <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    )
}
