"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield } from "lucide-react"

interface CaptchaProps {
  onVerify: () => void
}

export function Captcha({ onVerify }: CaptchaProps) {
  const [isChecked, setIsChecked] = React.useState(false)
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [isVerified, setIsVerified] = React.useState(false)

  const handleCheck = (checked: boolean) => {
    setIsChecked(checked)
    if (checked) {
      setIsVerifying(true)
      // Simulate verification delay
      setTimeout(() => {
        setIsVerifying(false)
        setIsVerified(true)
        onVerify()
      }, 1500)
    } else {
      setIsVerified(false)
    }
  }

  return (
    <div className="flex items-center space-x-2 rounded-md border p-4">
      <Checkbox id="captcha" checked={isChecked} onCheckedChange={handleCheck} disabled={isVerifying || isVerified} />
      <div className="flex-1 space-y-1">
        <div className="flex items-center">
          <label
            htmlFor="captcha"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {isVerifying ? "Verifying..." : isVerified ? "Verified" : "I'm not a robot"}
          </label>
          {isVerified && <Shield className="ml-2 h-4 w-4 text-green-500" />}
        </div>
        <p className="text-xs text-muted-foreground">This helps us prevent automated abuse.</p>
      </div>
      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
        <span className="text-xs text-muted-foreground">reCAPTCHA</span>
      </div>
    </div>
  )
}
