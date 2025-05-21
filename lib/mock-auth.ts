import type { LoginRequest, LoginResponse } from "./types"

// Mock user credentials for testing
const MOCK_USERS = [
  {
    email: "demo@example.com",
    password: "password123",
    userId: "mock-user-1",
    username: "DemoUser",
  },
]

// Mock login function
export async function mockLogin(credentials: LoginRequest): Promise<{
  success: boolean
  message: string
  data?: LoginResponse
}> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Find user with matching credentials
  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password,
  )

  if (user) {
    // Successful login
    return {
      success: true,
      message: "Login successful",
      data: {
        token: "mock-jwt-token-" + Math.random().toString(36).substring(2, 15),
        userId: user.userId,
        username: user.username,
      },
    }
  } else {
    // Failed login
    return {
      success: false,
      message: "Invalid email or password",
    }
  }
}
