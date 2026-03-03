import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: process.env.EMAIL_SERVER_PORT === "465",
})

export async function sendVerificationEmail(email: string, token: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`

    const mailOptions = {
        from: `"${process.env.NEXT_PUBLIC_CLINIC_NAME || "Sri Ram RMP Clinic"}" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
        to: email,
        subject: "Verify your email - Sri Ram RMP Clinic",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
                <h2 style="color: #2563eb; margin-bottom: 16px;">Email Verification</h2>
                <p>Thank you for registering with <strong>${process.env.NEXT_PUBLIC_CLINIC_NAME || "Sri Ram RMP Clinic"}</strong>.</p>
                <p>Please click the button below to verify your email address and activate your account:</p>
                <div style="margin: 32px 0;">
                    <a href="${verificationUrl}" 
                       style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                        Verify Email Address
                    </a>
                </div>
                <p style="font-size: 14px; color: #64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="font-size: 14px; word-break: break-all;"><a href="${verificationUrl}">${verificationUrl}</a></p>
                <hr style="margin: 32px 0; border: 0; border-top: 1px solid #e2e8f0;" />
                <p style="font-size: 12px; color: #94a3b8;">This link will expire in 24 hours. If you did not create an account, please ignore this email.</p>
            </div>
        `,
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.error("Error sending verification email:", error)
        throw new Error("Failed to send verification email")
    }
}

export async function sendPasswordResetEmail(email: string, token: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

    const mailOptions = {
        from: `"${process.env.NEXT_PUBLIC_CLINIC_NAME || "Sri Ram RMP Clinic"}" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
        to: email,
        subject: "Reset your password - Sri Ram RMP Clinic",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
                <h2 style="color: #2563eb; margin-bottom: 16px;">Password Reset Request</h2>
                <p>We received a request to reset your password for your account at <strong>${process.env.NEXT_PUBLIC_CLINIC_NAME || "Sri Ram RMP Clinic"}</strong>.</p>
                <p>Please click the button below to set a new password:</p>
                <div style="margin: 32px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                        Reset Password
                    </a>
                </div>
                <p style="font-size: 14px; color: #64748b;">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
                <p style="font-size: 14px; color: #64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="font-size: 14px; word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
                <hr style="margin: 32px 0; border: 0; border-top: 1px solid #e2e8f0;" />
                <p style="font-size: 12px; color: #94a3b8;">This link will expire in 1 hour.</p>
            </div>
        `,
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.error("Error sending password reset email:", error)
        throw new Error("Failed to send password reset email")
    }
}
