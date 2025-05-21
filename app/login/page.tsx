"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, error: authError, clearError, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme } = useTheme()
  const isDark = theme === "dark"

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
    },
  })

  // Handle form submission
  const onSubmit = async (values: LoginFormValues) => {
    setUrlError(null)
    const success = await login(values)
    if (success) {
      router.push(redirectPath)
    }
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
              <h1 className="text-3xl font-heading font-bold mb-2">Welcome Back</h1>
              <p className={cn("text-sm", isDark ? "text-white/70" : "text-gray-600")}>
                Sign in to access your LacQuer account
              </p>
            </div>

            {(authError || urlError) && (
              <Alert
                variant="destructive"
                className={cn(
                  "mb-6",
                  isDark ? "bg-red-900/20 text-red-300 border-red-900/50" : "bg-red-50 text-red-800 border-red-200",
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
                            className={cn(
                              "pr-10",
                              isDark
                                ? "bg-white/10 border-white/20 focus-visible:ring-lacquer-red/50 text-white placeholder:text-white/60"
                                : "bg-white/60 border-gray-200/50 focus-visible:ring-lacquer-red/30 text-gray-800 placeholder:text-gray-600/60",
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff
                                className={cn("h-4 w-4", isDark ? "text-white/60" : "text-gray-500")}
                                aria-hidden="true"
                              />
                            ) : (
                              <Eye
                                className={cn("h-4 w-4", isDark ? "text-white/60" : "text-gray-500")}
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

                <Button type="submit" className="w-full bg-lacquer-red hover:bg-lacquer-red/90" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className={cn("text-sm", isDark ? "text-white/70" : "text-gray-600")}>
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className={cn("p-0", isDark ? "text-white" : "text-lacquer-red")}
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
