"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { MailCheck } from "lucide-react"

interface VerificationPendingProps {
  email: string
  onLogin: () => void
  onResendVerification: () => void
}

export function VerificationPending({ email, onLogin, onResendVerification }: VerificationPendingProps) {
  const [isResending, setIsResending] = React.useState(false)
  const [resendSuccess, setResendSuccess] = React.useState(false)

  const handleResend = () => {
    setIsResending(true)
    // Simulate API call
    setTimeout(() => {
      setIsResending(false)
      setResendSuccess(true)
      // Reset success message after 5 seconds
      setTimeout(() => setResendSuccess(false), 5000)
      onResendVerification()
    }, 1500)
  }

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <MailCheck className="h-10 w-10 text-lacquer-red" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading tracking-tight">Check your email</h1>
        <p className="text-muted-foreground">
          We've sent a verification link to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <p className="text-sm text-muted-foreground">Didn't receive the email? Check your spam folder or try again.</p>

        <Button onClick={handleResend} disabled={isResending || resendSuccess} variant="outline" className="w-full">
          {isResending ? "Sending..." : resendSuccess ? "Email sent!" : "Resend verification email"}
        </Button>

        <div className="text-center text-sm">
          <Button variant="link" className="p-0 text-lacquer-red" onClick={onLogin}>
            Back to login
          </Button>
        </div>
      </div>
    </div>
  )
}
