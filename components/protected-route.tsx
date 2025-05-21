"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wait until auth state is loaded
    if (!isLoading && !isAuthenticated) {
      // Add the current path as a redirect parameter
      const currentPath = window.location.pathname
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`)
    }
  }, [isAuthenticated, isLoading, redirectTo, router])

  // Show nothing while loading or redirecting
  if (isLoading || !isAuthenticated) {
    return null
  }

  // If authenticated, render children
  return <>{children}</>
}
