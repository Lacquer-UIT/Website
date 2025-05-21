"use client"

import { useEffect, useState, forwardRef, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"

export interface ReCaptchaV3Props {
  siteKey: string
  onVerify: (token: string) => void
  action?: string
  className?: string
}

// Token validity duration in milliseconds (2 minutes)
const TOKEN_VALIDITY_DURATION = 2 * 60 * 1000;

const ReCaptchaV3 = forwardRef<HTMLDivElement, ReCaptchaV3Props>(
  ({ siteKey, onVerify, action = "submit", className }, ref) => {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const lastTokenTimestamp = useRef<number | null>(null)
    const currentToken = useRef<string | null>(null)

    // Load the reCAPTCHA v3 script
    useEffect(() => {
      if (typeof window !== "undefined" && !window.grecaptcha) {
        // Create a unique ID for this instance
        const scriptId = `recaptcha-v3-script-${Math.random().toString(36).substring(2, 9)}`
        
        // Check if script already exists
        if (document.getElementById(scriptId)) {
          setLoaded(true)
          return
        }

        // Load reCAPTCHA v3 script
        const script = document.createElement("script")
        script.id = scriptId
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
        script.async = true
        script.defer = true
        
        script.onload = () => {
          setLoaded(true)
        }
        
        script.onerror = () => {
          setError("Failed to load reCAPTCHA")
        }
        
        document.head.appendChild(script)
        
        return () => {
          // Only remove if script exists and was created by this component
          if (document.getElementById(scriptId)) {
            document.head.removeChild(script)
          }
        }
      } else if (window.grecaptcha && window.grecaptcha.ready) {
        setLoaded(true)
      }
    }, [siteKey])

    // Execute reCAPTCHA when ready
    const executeRecaptcha = useCallback(() => {
      if (loaded && window.grecaptcha) {
        const now = Date.now();
        
        // Check if we already have a valid token
        if (
          currentToken.current && 
          lastTokenTimestamp.current && 
          (now - lastTokenTimestamp.current < TOKEN_VALIDITY_DURATION)
        ) {
          // Token is still valid, no need to request a new one
          return;
        }
        
        try {
          window.grecaptcha.ready(async () => {
            try {
              const token = await window.grecaptcha.execute(siteKey, { action })
              // Store the token and timestamp
              currentToken.current = token;
              lastTokenTimestamp.current = Date.now();
              onVerify(token)
            } catch (err) {
              setError("reCAPTCHA execution failed")
              console.error("reCAPTCHA execution error:", err)
            }
          })
        } catch (err) {
          setError("reCAPTCHA is not ready")
          console.error("reCAPTCHA ready error:", err)
        }
      }
    }, [loaded, siteKey, action, onVerify])

    // Execute reCAPTCHA when component loads and is ready
    useEffect(() => {
      if (loaded) {
        executeRecaptcha()
      }
    }, [loaded, executeRecaptcha])

    return (
      <div ref={ref} className={cn("w-full", className)}>
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
        <div 
          id="recaptcha-container" 
          className="g-recaptcha" 
          data-sitekey={siteKey} 
          data-size="invisible"
        />
      </div>
    )
  }
)

ReCaptchaV3.displayName = "ReCaptchaV3"

export { ReCaptchaV3 }

// Add type definitions for window object
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
      render: (container: string | HTMLElement, options: any) => void
    }
  }
} 