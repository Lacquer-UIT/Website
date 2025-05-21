"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [plusSigns, setPlusSigns] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    opacity: number
    duration: number
  }>>([])

  useEffect(() => {
    setMounted(true)
    // Generate random values only on client side
    setPlusSigns(
      Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 30 + 20,
        opacity: Math.random() * 0.3 + 0.1,
        duration: Math.random() * 20 + 20,
      }))
    )
  }, [])

  // Use resolvedTheme instead of theme to get the actual theme value
  const isDark = resolvedTheme === "dark"

  // Return a simple div during SSR and initial client render
  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden" />
  }

  return (
    <div className="absolute inset-0 overflow-hidden" ref={containerRef}>
      {plusSigns.map((plus) => (
        <motion.div
          key={plus.id}
          className={isDark ? "absolute text-lacquer-red" : "absolute text-lacquer-red/30"}
          initial={{
            x: `${plus.x}%`,
            y: `${plus.y}%`,
            opacity: plus.opacity,
            scale: 1,
          }}
          animate={{
            y: [`${plus.y}%`, `${plus.y - 10}%`, `${plus.y}%`],
            opacity: [plus.opacity, plus.opacity + 0.1, plus.opacity],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: plus.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            fontSize: plus.size,
            filter: "blur(8px)",
          }}
        >
          +
        </motion.div>
      ))}
      <div
        className={
          isDark
            ? "absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/80 to-black"
            : "absolute inset-0 bg-gradient-to-b from-transparent via-[#f8f4e9]/80 to-white"
        }
      />
    </div>
  )
}
