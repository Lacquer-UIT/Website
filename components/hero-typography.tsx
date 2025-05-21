"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"

export function HeroTypography() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, username } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="text-center">
        <div className="h-16 sm:h-20 md:h-24" /> {/* Placeholder for h1 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <div className="h-12 sm:h-16 md:h-20" /> {/* Placeholder for "Welcome to" */}
          <div className="h-14 sm:h-16 md:h-20" /> {/* Placeholder for "LacQuer" */}
        </div>
      </div>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h1
        className={cn(
          "font-pacifico text-5xl sm:text-6xl md:text-7xl leading-tight",
          isDark
            ? "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            : "text-gray-800 drop-shadow-[0_0_15px_rgba(0,0,0,0.2)]",
        )}
        animate={{
          textShadow: isDark
            ? ["0 0 7px rgba(255,255,255,0.3)", "0 0 10px rgba(255,255,255,0.5)", "0 0 7px rgba(255,255,255,0.3)"]
            : ["0 0 7px rgba(0,0,0,0.1)", "0 0 10px rgba(0,0,0,0.2)", "0 0 7px rgba(0,0,0,0.1)"],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        Hello{isAuthenticated ? `, ${username}` : ","}
      </motion.h1>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <motion.span
          className={cn("font-pacifico text-3xl sm:text-4xl md:text-5xl", isDark ? "text-white" : "text-gray-800")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Welcome to
        </motion.span>
        <motion.span
          className={cn(
            "font-heading font-bold text-4xl sm:text-5xl md:text-6xl",
            "text-transparent bg-clip-text",
            isDark
              ? "bg-gradient-to-r from-red-300 to-yellow-200 drop-shadow-[0_0_10px_rgba(255,100,100,0.5)]"
              : "bg-gradient-to-r from-red-700 to-amber-600 drop-shadow-[0_0_10px_rgba(200,50,50,0.3)]",
          )}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            textShadow: isDark
              ? ["0 0 7px rgba(255,100,100,0.3)", "0 0 10px rgba(255,100,100,0.5)", "0 0 7px rgba(255,100,100,0.3)"]
              : ["0 0 7px rgba(200,50,50,0.2)", "0 0 10px rgba(200,50,50,0.3)", "0 0 7px rgba(200,50,50,0.2)"],
          }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            textShadow: {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
            },
          }}
        >
          LacQuer
        </motion.span>
      </div>
    </motion.div>
  )
}
