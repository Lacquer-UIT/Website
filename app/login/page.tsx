"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, AlertCircle, Copy, ShieldCheck } from "lucide-react"
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
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  recaptchaToken: z.string({ required_error: "ReCAPTCHA verification failed" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, error: authError, clearError, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null)
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)
  const recaptchaContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // After hydration, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Use a safe default for server-side rendering
  // Only use theme detection on client after mounting
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark")

  // Get reCAPTCHA site key from environment variable
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""

  // Get redirect path from URL if present
  const redirectPath = searchParams.get("redirect") || "/"

  // Check for error message in URL
  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam === "session_expired") {
      setUrlError("Your session has expired. Please log in again.")
    }
  }, [searchParams])

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      recaptchaToken: "",
    },
  })

  // Handle form submission
  const onSubmit = async (values: LoginFormValues) => {
    setUrlError(null)
    setRecaptchaError(null)
    
    // Get a fresh token right before submission
    if (window.grecaptcha) {
      try {
        window.grecaptcha.ready(async () => {
          try {
            const freshToken = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'login' })
            const updatedValues = { ...values, recaptchaToken: freshToken }
            
            const success = await login(updatedValues)
            if (success) {
              router.push(redirectPath)
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
      const success = await login(values)
      if (success) {
        router.push(redirectPath)
      }
    }
  }

  // Handle captcha verification
  const handleCaptchaVerify = (token: string) => {
    form.setValue("recaptchaToken", token)
    setRecaptchaVerified(true)
    setRecaptchaError(null)
  }

  // Use a consistent theme for server-side rendering
  // We'll use a simple style for the initial render
  const initialCardStyle = "rounded-2xl p-8 backdrop-blur-md shadow-md bg-white/60 border border-gray-200/50"
  
  // Apply theme-based styles only after client-side hydration
  const cardStyle = mounted 
    ? cn(
        "rounded-2xl p-8 backdrop-blur-md shadow-md",
        isDark ? "bg-white/5 border border-white/10" : "bg-white/60 border border-gray-200/50",
      )
    : initialCardStyle

  const textStyle = mounted
    ? cn("text-sm", isDark ? "text-white/70" : "text-gray-600")
    : "text-sm text-gray-600"
    
  const inputStyle = mounted
    ? cn(
        isDark
          ? "bg-white/10 border-white/20 focus-visible:ring-lacquer-red/50 text-white placeholder:text-white/60"
          : "bg-white/60 border-gray-200/50 focus-visible:ring-lacquer-red/30 text-gray-800 placeholder:text-gray-600/60",
      )
    : "bg-white/60 border-gray-200/50 focus-visible:ring-lacquer-red/30 text-gray-800 placeholder:text-gray-600/60"
    
  const iconStyle = mounted
    ? cn("h-4 w-4", isDark ? "text-white/60" : "text-gray-500")
    : "h-4 w-4 text-gray-500"
    
  const linkStyle = mounted
    ? cn("p-0", isDark ? "text-white" : "text-lacquer-red")
    : "p-0 text-lacquer-red"

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
          <div className={cardStyle}>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-heading font-bold mb-2">Welcome Back</h1>
              <p className={textStyle}>
                Sign in to access your LacQuer account
              </p>
            </div>

            {(authError || urlError) && (
              <Alert
                variant="destructive"
                className={cn(
                  "mb-6",
                  mounted && (isDark ? "bg-red-900/20 text-red-300 border-red-900/50" : "bg-red-50 text-red-800 border-red-200"),
                )}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError || urlError}</AlertDescription>
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
                          {...field}
                          className={inputStyle}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className={cn("pr-10", inputStyle)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff
                                className={iconStyle}
                                aria-hidden="true"
                              />
                            ) : (
                              <Eye
                                className={iconStyle}
                                aria-hidden="true"
                              />
                            )}
                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                          </button>
                        </div>
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
                    action="login"
                  />
                </div>

                {recaptchaVerified && (
                  <div className={cn(
                    "flex items-center gap-2 py-2 px-3 rounded-md text-sm",
                    mounted && (isDark ? "bg-green-900/20 text-green-300" : "bg-green-50 text-green-800")
                  )}>
                    <ShieldCheck className="h-4 w-4" />
                    <span>reCAPTCHA verification successful</span>
                  </div>
                )}

                {recaptchaError && (
                  <div className={cn(
                    "flex items-center gap-2 py-2 px-3 rounded-md text-sm",
                    mounted && (isDark ? "bg-red-900/20 text-red-300" : "bg-red-50 text-red-800")
                  )}>
                    <AlertCircle className="h-4 w-4" />
                    <span>{recaptchaError}</span>
                  </div>
                )}

                <Button type="submit" className="w-full bg-lacquer-red hover:bg-lacquer-red/90" disabled={isLoading || !recaptchaVerified}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className={textStyle}>
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className={linkStyle}
                  onClick={() => router.push("/signup")}
                >
                  Sign up
                </Button>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  )
}
