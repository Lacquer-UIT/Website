import { Inter, Albert_Sans, Pacifico } from "next/font/google"

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert-sans",
})

export const pacifico = Pacifico({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-pacifico",
})
