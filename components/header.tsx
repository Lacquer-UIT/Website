"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Moon, Sun, User, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Dictionary", href: "/dictionary" },
  { name: "Deck", href: "/deck" },
  { name: "Tag", href: "/tag" },
  { name: "Badge", href: "/badge" },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, username, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 bg-transparent py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="h-10 w-10" />
            <div className="hidden md:block">
              <div className="h-6 w-48" />
            </div>
            <div className="h-8 w-8" />
          </div>
        </header>
        <div className="h-16" /> {/* Spacer */}
      </>
    )
  }

  const isDark = theme === "dark"

  const getUserInitials = () => {
    if (!username) return "G"
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const headerHeightClass = isScrolled ? "h-14" : "h-16"

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? isDark
              ? "bg-black/30 backdrop-blur-lg border-b border-white/10 py-2"
              : "bg-white/30 backdrop-blur-lg border-b border-gray-200/20 py-2"
            : "bg-transparent py-4",
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="LacQuer Logo" width={40} height={40} className="h-10 w-auto" />
          </Link>

          {/* Nav */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <motion.li key={item.name} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                    <Link
                      href={item.href}
                      className={cn(
                        "font-medium transition-colors",
                        isDark
                          ? isActive
                            ? "text-white font-semibold"
                            : "text-white/80 hover:text-white"
                          : isActive
                            ? "text-gray-900 font-semibold"
                            : "text-gray-700 hover:text-gray-900",
                      )}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                )
              })}
            </ul>
          </nav>

          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <select
              className={cn(
                "backdrop-blur-md border-0 rounded-lg p-2 focus:ring-0 focus:outline-none",
                isDark ? "bg-white/10 text-white" : "bg-gray-100/80 text-gray-800",
              )}
              onChange={(e) => {
                window.location.href = e.target.value
              }}
              defaultValue={pathname}
            >
              {navItems.map((item) => (
                <option key={item.name} value={item.href}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Theme toggle + user */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={cn(
                "p-2 rounded-full backdrop-blur-md hover:bg-opacity-30 transition-colors",
                isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100/80 hover:bg-gray-200/80",
              )}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-gray-800" />}
            </button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center space-x-2 rounded-full p-1 transition-colors",
                      isDark ? "hover:bg-white/10" : "hover:bg-gray-100/80",
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={cn(isDark ? "bg-lacquer-red/20 text-white" : "bg-lacquer-red/10 text-lacquer-red")}
                      >
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    <p>{username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors",
                  isDark
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-800",
                )}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* This is the magic spacer 👇 */}
      <div className={cn("w-full", isScrolled ? "h-14" : "h-16")} />
    </>
  )
}