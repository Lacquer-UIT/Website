import type { ApiResponse } from "./types"
import { API_CONFIG } from "@/config/api-config"

// Function to get token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("lacquer_token")
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`

  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")

  // Add auth token if available - using Bearer token format
  const token = getAuthToken()
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const config: RequestInit = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(url, config)

    // Handle unauthorized errors (401)
    if (response.status === 401) {
      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("lacquer_token")
        localStorage.removeItem("lacquer_user_id")
        localStorage.removeItem("lacquer_username")

        // Redirect to login page
        window.location.href = "/login?error=session_expired"
      }
      throw new Error("Authentication required. Your session may have expired.")
    }

    if (!response.ok) {
      // Handle other HTTP errors
      const errorData = await response.json().catch(() => ({ message: `HTTP error: ${response.status}` }))
      throw new Error(errorData.message || `API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}
