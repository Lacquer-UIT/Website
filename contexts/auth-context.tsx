"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type {
  LoginRequest,
  SignupRequest,
  ResendVerificationRequest,
  UpdateProfileRequest,
  LoginResponse,
  UserProfile,
  AuthState,
} from "@/lib/types"
import { API_CONFIG } from "@/config/api-config"
import { fetchApi } from "@/lib/api-client"

// Define the shape of our context
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<boolean>
  signup: (data: SignupRequest) => Promise<{ success: boolean; message: string }>
  resendVerification: (data: ResendVerificationRequest) => Promise<{ success: boolean; message: string }>
  getProfile: () => Promise<UserProfile | null>
  updateProfile: (data: UpdateProfileRequest) => Promise<UserProfile | null>
  logout: () => void
  clearError: () => void
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Storage keys
const TOKEN_KEY = "lacquer_token"
const USER_ID_KEY = "lacquer_user_id"
const USERNAME_KEY = "lacquer_username"

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    userId: null,
    username: null,
    isLoading: true,
    error: null,
  })
  const router = useRouter()

  // Check for existing auth on mount
  useEffect(() => {
    const loadAuthFromStorage = () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY)
        const userId = localStorage.getItem(USER_ID_KEY)
        const username = localStorage.getItem(USERNAME_KEY)

        if (token && userId && username) {
          setAuthState({
            isAuthenticated: true,
            token,
            userId,
            username,
            isLoading: false,
            error: null,
          })
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error("Error loading auth from storage:", error)
        setAuthState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    loadAuthFromStorage()
  }, [])

  // Login function
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Use real API endpoint from config
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || `Login failed with status: ${response.status}`)
      }

      // Extract data from response
      const { token, userId, username } = responseData.data as LoginResponse

      // Save to localStorage
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_ID_KEY, userId)
      localStorage.setItem(USERNAME_KEY, username)

      // Update state
      setAuthState({
        isAuthenticated: true,
        token,
        userId,
        username,
        isLoading: false,
        error: null,
      })

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during login"
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      return false
    }
  }

  // Signup function
  const signup = async (data: SignupRequest): Promise<{ success: boolean; message: string }> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNUP}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || `Signup failed with status: ${response.status}`)
      }

      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return { success: true, message: responseData.message }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during signup"
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      return { success: false, message: errorMessage }
    }
  }

  // Resend verification function
  const resendVerification = async (
    data: ResendVerificationRequest,
  ): Promise<{ success: boolean; message: string }> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESEND_VERIFICATION}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || `Resend verification failed with status: ${response.status}`)
      }

      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return { success: true, message: responseData.message }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred during verification resend"
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      return { success: false, message: errorMessage }
    }
  }

  // Get profile function
  const getProfile = async (): Promise<UserProfile | null> => {
    if (!authState.isAuthenticated) {
      return null
    }

    try {
      const response = await fetchApi<UserProfile>(API_CONFIG.ENDPOINTS.PROFILE)
      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (error) {
      console.error("Error fetching profile:", error)
      return null
    }
  }

  // Update profile function
  const updateProfile = async (data: UpdateProfileRequest): Promise<UserProfile | null> => {
    if (!authState.isAuthenticated) {
      return null
    }

    try {
      const response = await fetchApi<UserProfile>(API_CONFIG.ENDPOINTS.PROFILE, {
        method: "PUT",
        body: JSON.stringify(data),
      })

      if (response.success && response.data) {
        // If username was updated, update localStorage and state
        if (data.username && data.username !== authState.username) {
          localStorage.setItem(USERNAME_KEY, data.username)
          setAuthState((prev) => ({
            ...prev,
            username: data.username,
          }))
        }
        return response.data
      }
      return null
    } catch (error) {
      console.error("Error updating profile:", error)
      return null
    }
  }

  // Logout function
  const logout = () => {
    // Clear from localStorage
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_ID_KEY)
    localStorage.removeItem(USERNAME_KEY)

    // Update state
    setAuthState({
      isAuthenticated: false,
      token: null,
      userId: null,
      username: null,
      isLoading: false,
      error: null,
    })

    // Redirect to login page
    router.push("/login")
  }

  // Clear error function
  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }))
  }

  const value = {
    ...authState,
    login,
    signup,
    resendVerification,
    getProfile,
    updateProfile,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
