import { RegisterForm } from "@/components/register-form"
import { StoreProvider } from "@/lib/store"

export default function RegisterPage() {
    return (
        <StoreProvider>
            <RegisterForm />
        </StoreProvider>
    )
}
