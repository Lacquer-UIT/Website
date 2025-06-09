"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield } from "lucide-react"

interface CaptchaProps {
  onVerify: (token: string) => void
}

export function Captcha({ onVerify }: CaptchaProps) {
  const [isChecked, setIsChecked] = React.useState(false)
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [isVerified, setIsVerified] = React.useState(false)
  const [recaptchaLoaded, setRecaptchaLoaded] = React.useState(false)

  // Get reCAPTCHA site key from environment variable
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""

  // Load reCAPTCHA script
  React.useEffect(() => {
    if (!siteKey) {
      console.warn("reCAPTCHA site key is not configured")
      return
    }

    const loadRecaptcha = () => {
      if (typeof window !== 'undefined' && !window.grecaptcha) {
        const script = document.createElement('script')
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
        script.async = true
        script.defer = true
        script.onload = () => {
          setRecaptchaLoaded(true)
        }
        document.head.appendChild(script)
      } else if (window.grecaptcha) {
        setRecaptchaLoaded(true)
      }
    }

    loadRecaptcha()
  }, [siteKey])

  const handleCheck = async (checked: boolean) => {
    setIsChecked(checked)
    
    if (checked) {
      setIsVerifying(true)
      
      try {
        if (!siteKey) {
          // Fallback for development - use simulated token
          setTimeout(() => {
            setIsVerifying(false)
            setIsVerified(true)
            onVerify("simulated-captcha-token")
          }, 1500)
          return
        }

        if (window.grecaptcha && recaptchaLoaded) {
          window.grecaptcha.ready(async () => {
            try {
              const token = await window.grecaptcha.execute(siteKey, { action: 'login' })
              setIsVerifying(false)
              setIsVerified(true)
              onVerify(token)
            } catch (error) {
              console.error("reCAPTCHA execution failed:", error)
              setIsVerifying(false)
              setIsChecked(false)
              // Fallback to simulated token
              onVerify("simulated-captcha-token")
            }
          })
        } else {
          // Fallback if reCAPTCHA is not loaded
          setTimeout(() => {
            setIsVerifying(false)
            setIsVerified(true)
            onVerify("simulated-captcha-token")
          }, 1500)
        }
      } catch (error) {
        console.error("reCAPTCHA error:", error)
        setIsVerifying(false)
        setIsChecked(false)
      }
    } else {
      setIsVerified(false)
    }
  }

  return (
    <div className="flex items-center space-x-2 rounded-md border p-4">
      <Checkbox 
        id="captcha" 
        checked={isChecked} 
        onCheckedChange={handleCheck} 
        disabled={isVerifying || isVerified} 
      />
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

// Extend the Window interface to include grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}
