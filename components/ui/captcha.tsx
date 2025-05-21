"use client"

import { forwardRef, useCallback } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export interface CaptchaProps {
  siteKey: string
  onChange: (token: string | null) => void
  className?: string
  error?: boolean
  errorMessage?: string
}

const Captcha = forwardRef<ReCAPTCHA, CaptchaProps>(
  ({ siteKey, onChange, className, error, errorMessage }, ref) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const handleChange = useCallback(
      (token: string | null) => {
        onChange(token)
      },
      [onChange]
    )

    return (
      <div className={cn("w-full", className)}>
        <div className={cn("flex justify-center", error ? "border border-red-500 rounded-md" : "")}>
          <ReCAPTCHA
            ref={ref}
            sitekey={siteKey}
            onChange={handleChange}
            theme={isDark ? "dark" : "light"}
          />
        </div>
        {error && errorMessage && (
          <p className={cn("text-sm mt-1", isDark ? "text-red-400" : "text-red-500")}>{errorMessage}</p>
        )}
      </div>
    )
  }
)

Captcha.displayName = "Captcha"

export { Captcha } 