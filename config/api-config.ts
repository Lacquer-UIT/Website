// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://lacquer.up.railway.app",
  ENDPOINTS: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/register",
    RESEND_VERIFICATION: "/auth/resend",
    PROFILE: "/auth/profile",
    TAGS: "/tag",
  },
}
