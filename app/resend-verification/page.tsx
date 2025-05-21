"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ReCaptchaV3 } from "@/components/ui/recaptcha-v3"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

// Form validation schema
const resendSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  recaptchaToken: z.string({ required_error: "ReCAPTCHA verification failed" }),
})

type ResendFormValues = z.infer<typeof resendSchema>

export default function ResendVerificationPage() {
  const { resendVerification, error: authError, clearError, isLoading } = useAuth()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null)
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)
  const recaptchaContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Get reCAPTCHA site key from environment variable
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""

  // Initialize form
  const form = useForm<ResendFormValues>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: "",
      recaptchaToken: "",
    },
  })

  // Handle form submission
  const onSubmit = async (values: ResendFormValues) => {
    clearError()
    setSuccessMessage(null)
    setRecaptchaError(null)

    // Get a fresh token right before submission
    if (window.grecaptcha) {
      try {
        window.grecaptcha.ready(async () => {
          try {
            const freshToken = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'resend_verification' })
            const updatedValues = { ...values, recaptchaToken: freshToken }
            
            const result = await resendVerification(updatedValues)
            if (result.success) {
              setSuccessMessage(result.message)
              form.reset()
              // Refresh captcha
              if (window.grecaptcha) {
                window.grecaptcha.ready(async () => {
                  const newToken = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'resend_verification' })
                  form.setValue("recaptchaToken", newToken)
                })
              }
            }
          } catch (err) {
            setRecaptchaError("ReCAPTCHA verification failed")
            console.error("ReCAPTCHA error:", err)
          }
        })
      } catch (err) {
        setRecaptchaError("ReCAPTCHA is not available")
        console.error("ReCAPTCHA ready error:", err)
      }
    } else {
      // Fallback if grecaptcha is not loaded
      const result = await resendVerification(values)
      if (result.success) {
        setSuccessMessage(result.message)
        form.reset()
      }
    }
  }

  // Handle captcha verification
  const handleCaptchaVerify = (token: string) => {
    form.setValue("recaptchaToken", token)
    setRecaptchaVerified(true)
    setRecaptchaError(null)
  }

  return (
    <>
      <Header />
      <main
        className={cn(
          "min-h-screen pt-20 p-4",
          "bg-gradient-to-b dark:from-gray-900 dark:to-black dark:text-white light:from-[#f8f4e9] light:to-white light:text-gray-800",
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div
            className={cn(
              "rounded-2xl p-8 backdrop-blur-md shadow-md",
              isDark ? "bg-white/5 border border-white/10" : "bg-white/60 border border-gray-200/50",
            )}
          >
            <div className="text-center mb-6">
              <h1 className="text-3xl font-heading font-bold mb-2">Resend Verification</h1>
              <p className={cn("text-sm", isDark ? "text-white/70" : "text-gray-600")}>
                Enter your email to receive a new verification link
              </p>
            </div>

            {authError && (
              <Alert
                variant="destructive"
                className={cn(
                  "mb-6",
                  isDark ? "bg-red-900/20 text-red-300 border-red-900/50" : "bg-red-50 text-red-800 border-red-200",
                )}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert
                className={cn(
                  "mb-6",
                  isDark
                    ? "bg-green-900/20 text-green-300 border-green-900/50"
                    : "bg-green-50 text-green-800 border-green-200",
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          type="email"
                          {...field}
                          className={cn(
                            isDark
                              ? "bg-white/10 border-white/20 focus-visible:ring-lacquer-red/50 text-white placeholder:text-white/60"
                              : "bg-white/60 border-gray-200/50 focus-visible:ring-lacquer-red/30 text-gray-800 placeholder:text-gray-600/60",
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Invisible reCAPTCHA v3 */}
                <div ref={recaptchaContainerRef} className="hidden">
                  <ReCaptchaV3
                    siteKey={recaptchaSiteKey}
                    onVerify={handleCaptchaVerify}
                    action="resend_verification"
                  />
                </div>

                {recaptchaVerified && (
                  <div className={cn(
                    "flex items-center gap-2 py-2 px-3 rounded-md text-sm",
                    isDark ? "bg-green-900/20 text-green-300" : "bg-green-50 text-green-800"
                  )}>
                    <ShieldCheck className="h-4 w-4" />
                    <span>reCAPTCHA verification successful</span>
                  </div>
                )}

                {recaptchaError && (
                  <div className={cn(
                    "flex items-center gap-2 py-2 px-3 rounded-md text-sm",
                    isDark ? "bg-red-900/20 text-red-300" : "bg-red-50 text-red-800"
                  )}>
                    <AlertCircle className="h-4 w-4" />
                    <span>{recaptchaError}</span>
                  </div>
                )}

                <Button type="submit" className="w-full bg-lacquer-red hover:bg-lacquer-red/90" disabled={isLoading || !recaptchaVerified}>
                  {isLoading ? "Sending..." : "Resend Verification Email"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className={cn("text-sm", isDark ? "text-white/70" : "text-gray-600")}>
                Remember your password?{" "}
                <Button
                  variant="link"
                  className={cn("p-0", isDark ? "text-white" : "text-lacquer-red")}
                  onClick={() => router.push("/login")}
                >
                  Back to login
                </Button>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  )
}
