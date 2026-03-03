"use client"

import { ResetPasswordForm } from "@/components/reset-password-form"
import { StoreProvider } from "@/lib/store"

export default function ResetPasswordPage() {
    return (
        <StoreProvider>
            <ResetPasswordForm />
        </StoreProvider>
    )
}
