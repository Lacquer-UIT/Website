"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, AlertCircle, CheckCircle2, User, Mail, Calendar, Info } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { ProtectedRoute } from "@/components/protected-route"
import type { UserProfile } from "@/lib/types"

// Form validation schema
const profileSchema = z
  .object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }).optional(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
    about: z.string().optional(),
  })
  .refine((data) => data.username || data.password || data.about, {
    message: "At least one field must be filled",
    path: ["username"],
  })

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { isAuthenticated, getProfile, updateProfile } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      password: "",
      about: "",
    },
  })

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return

      try {
        setIsLoading(true)
        setError(null)
        const profileData = await getProfile()

        if (profileData) {
          setProfile(profileData)
          // Set initial form values
          form.setValue("username", profileData.username)
          form.setValue("about", profileData.about || "")
        } else {
          setError("Failed to load profile data")
        }
      } catch (err) {
        setError("An error occurred while fetching profile data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [isAuthenticated, getProfile, form])

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    setError(null)
    setSuccessMessage(null)

    try {
      // Filter out empty fields
      const updateData = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => value !== undefined && value !== ""),
      )

      // Only proceed if there's something to update
      if (Object.keys(updateData).length === 0) {
        setError("No changes to update")
        return
      }

      const updatedProfile = await updateProfile(updateData)

      if (updatedProfile) {
        setProfile(updatedProfile)
        setSuccessMessage("Profile updated successfully")

        // Clear password field
        form.setValue("password", "")
      } else {
        setError("Failed to update profile")
      }
    } catch (err) {
      setError("An error occurred while updating profile")
      console.error(err)
    }
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!profile?.username) return "U"
    return profile.username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const renderContent = () => (
    <>
      <Header />
      <main
        className={cn(
          "pt-20 min-h-screen p-4 md:p-8",
          "bg-gradient-to-b dark:from-gray-900 dark:to-black dark:text-white light:from-[#f8f4e9] light:to-white light:text-gray-800",
        )}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-heading font-bold mb-2">Profile</h1>
            <p className={cn("text-lg", isDark ? "text-white/70" : "text-gray-600")}>
              View and manage your account information
            </p>
          </motion.div>

          {error && (
            <Alert
              variant="destructive"
              className={cn(
                "mb-6",
                isDark ? "bg-red-900/20 text-red-300 border-red-900/50" : "bg-red-50 text-red-800 border-red-200",
              )}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
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

          <div
            className={cn(
              "rounded-2xl backdrop-blur-md shadow-md overflow-hidden",
              isDark ? "bg-white/5 border border-white/10" : "bg-white/60 border border-gray-200/50",
            )}
          >
            <Tabs defaultValue="info" className="w-full">
              <TabsList className={cn("w-full rounded-none p-0 h-auto", isDark ? "bg-white/10" : "bg-gray-100/50")}>
                <TabsTrigger
                  value="info"
                  className={cn(
                    "flex-1 rounded-none py-4 data-[state=active]:shadow-none",
                    isDark
                      ? "data-[state=active]:bg-white/5 data-[state=active]:text-white"
                      : "data-[state=active]:bg-white data-[state=active]:text-gray-900",
                  )}
                >
                  Profile Information
                </TabsTrigger>
                <TabsTrigger
                  value="edit"
                  className={cn(
                    "flex-1 rounded-none py-4 data-[state=active]:shadow-none",
                    isDark
                      ? "data-[state=active]:bg-white/5 data-[state=active]:text-white"
                      : "data-[state=active]:bg-white data-[state=active]:text-gray-900",
                  )}
                >
                  Edit Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="p-6">
                {isLoading ? (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      <Skeleton className="h-24 w-24 rounded-full" />
                      <div className="space-y-4 flex-1 text-center md:text-left">
                        <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                        <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                ) : profile ? (
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.username} />
                        <AvatarFallback
                          className={cn(
                            "text-xl",
                            isDark ? "bg-lacquer-red/20 text-white" : "bg-lacquer-red/10 text-lacquer-red",
                          )}
                        >
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2 flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold">{profile.username}</h2>
                        <p className={cn("text-sm", isDark ? "text-white/70" : "text-gray-600")}>{profile.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={cn("p-4 rounded-lg", isDark ? "bg-white/5" : "bg-white/40")}>
                        <div className="flex items-center gap-3 mb-2">
                          <User className={cn("h-5 w-5", isDark ? "text-white/70" : "text-gray-600")} />
                          <h3 className="font-medium">Username</h3>
                        </div>
                        <p>{profile.username}</p>
                      </div>

                      <div className={cn("p-4 rounded-lg", isDark ? "bg-white/5" : "bg-white/40")}>
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className={cn("h-5 w-5", isDark ? "text-white/70" : "text-gray-600")} />
                          <h3 className="font-medium">Email</h3>
                        </div>
                        <p>{profile.email}</p>
                      </div>

                      <div className={cn("p-4 rounded-lg", isDark ? "bg-white/5" : "bg-white/40")}>
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className={cn("h-5 w-5", isDark ? "text-white/70" : "text-gray-600")} />
                          <h3 className="font-medium">Member Since</h3>
                        </div>
                        <p>{formatDate(profile.createdAt)}</p>
                      </div>

                      <div className={cn("p-4 rounded-lg", isDark ? "bg-white/5" : "bg-white/40")}>
                        <div className="flex items-center gap-3 mb-2">
                          <Info className={cn("h-5 w-5", isDark ? "text-white/70" : "text-gray-600")} />
                          <h3 className="font-medium">About</h3>
                        </div>
                        <p>{profile.about || "No information provided"}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>Failed to load profile information. Please try again later.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="edit" className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter new username"
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
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
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

                    <FormField
                      control={form.control}
                      name="about"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about yourself"
                              {...field}
                              className={cn(
                                "min-h-32",
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

                    <div className="flex justify-end">
                      <Button type="submit" className="bg-lacquer-red hover:bg-lacquer-red/90">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </>
  )

  return <ProtectedRoute>{renderContent()}</ProtectedRoute>
}
