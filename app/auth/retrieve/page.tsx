"use client"

import { AuthRetrievalForm } from "@/components/auth-retrieval"
import { StoreProvider } from "@/lib/store"

export default function RetrievePage() {
    return (
        <StoreProvider>
            <AuthRetrievalForm />
        </StoreProvider>
    )
}
