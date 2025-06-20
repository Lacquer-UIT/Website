// API response types
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface TagsResponse {
  count: number
  data: Tag[]
}

export interface Tag {
  _id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  __v: number
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
  recaptchaToken: string
}

export interface SignupRequest {
  username: string
  email: string
  password: string
  recaptchaToken: string
}

export interface ResendVerificationRequest {
  email: string
  recaptchaToken: string
}

export interface UpdateProfileRequest {
  username?: string
  password?: string
  about?: string
}

export interface LoginResponse {
  token: string
  userId: string
  username: string
}

export interface UserProfile {
  _id: string
  username: string
  email: string
  about: string
  authProvider: "local" | "google"
  googleId: string | null
  avatar: string
  createdAt: string
  updatedAt: string
  __v: number
  badges?: any[]
  friendships?: any[]
}

export interface AuthState {
  isAuthenticated: boolean
  token: string | null
  userId: string | null
  username: string | null
  isLoading: boolean
  error: string | null
}

// Dictionary types
export interface EnglishWordType {
  _id: string
  type: string
  definitions: string[]
  examples: string[]
}

export interface EnglishWordResponse {
  img: string[]
  _id: string
  word: string
  pronunciation: string
  wordTypes: EnglishWordType[]
  difficulty: string
  examples: string[]
}

export interface VietnameseExample {
  _id: string
  phrase: string
  translation: string
}

export interface VietnameseDefinition {
  _id: string
  text: string
  examples: VietnameseExample[]
}

export interface VietnameseMeaning {
  part_of_speech: {
    type: string
  }
  _id: string
  definitions: VietnameseDefinition[]
}

export interface VietnameseWordResponse {
  _id: string
  word: string
  pronunciations: string[]
  img: string[]
  meanings: VietnameseMeaning[]
  difficulty_level: string
}

export interface SearchSuggestionsResponse {
  success: boolean
  message: string
  data: string[]
}

// Badge types
export interface Badge {
  _id: string
  name: string
  iconUrl: string
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface BadgeRequest {
  name: string
  icon?: File
}

export interface BadgesResponse {
  success: boolean
  message: string
  data: Badge[]
}

// Deck types
export interface DeckCard {
  _id: string
  word: string
  pronunciation: string
  meaning?: {
    type: string
    definition: string
  } | null
}

export interface Deck {
  _id: string
  owner?: string | null
  title: string
  description?: string
  img?: string
  isDone: boolean
  tags: Tag[]
  cards: DeckCard[]
  createdAt: string
  updatedAt: string
}

export interface DeckFormData {
  title: string
  description?: string
  img?: string
  tags?: string[]
  cards?: string[]
}

export interface DecksResponse {
  count: number
  data: Deck[]
}

export interface DecksByTagResponse {
  count: number
  data: {
    tag: Tag
    decks: Deck[]
  }[]
}
