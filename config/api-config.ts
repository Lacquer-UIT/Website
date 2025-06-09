// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://lacquer.up.railway.app",
  ENDPOINTS: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/register",
    RESEND_VERIFICATION: "/auth/resend",
    PROFILE: "/auth/profile",
    TAGS: "/tag",
    DICTIONARY_SEARCH_EN: "/search/en",
    DICTIONARY_SEARCH_VN: "/search/vn",
    RANDOM_WORD_EN: "/random/en",
    RANDOM_WORD_VN: "/random/vn",
    CHATBOT: "/chatbot",
    BADGES: "/badge",
  },
}
