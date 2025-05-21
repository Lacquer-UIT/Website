"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Header } from "@/components/header"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const initialMessage = searchParams.get("message") || ""
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    if (initialMessage) {
      const userMessage = {
        id: 1,
        text: initialMessage,
        sender: "user" as const,
      }

      setMessages([userMessage])
      setIsTyping(true)

      // Simulate bot response
      const timer = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: 2,
            text: "Welcome to LacQuer! I'm here to help you explore Vietnamese culture. What would you like to know about?",
            sender: "bot" as const,
          },
        ])
        setIsTyping(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [initialMessage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user" as const,
      }

      setMessages((prev) => [...prev, userMessage])
      setNewMessage("")
      setIsTyping(true)

      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "Thank you for your message. Our team is working on implementing a full chatbot experience. Please check back soon!",
            sender: "bot" as const,
          },
        ])
        setIsTyping(false)
      }, 1500)
    }
  }

  return (
    <>
      <Header />
      <div
        className={cn(
          "flex flex-col h-screen pt-16",
          isDark
            ? "bg-gradient-to-b from-gray-900 to-black text-white"
            : "bg-gradient-to-b from-[#f8f4e9] to-white text-gray-800",
        )}
      >
        <div className={cn("flex items-center p-4 border-b", isDark ? "border-white/10" : "border-gray-200/50")}>
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-heading">LacQuer Chat</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-2xl",
                  message.sender === "user"
                    ? isDark
                      ? "bg-lacquer-red/80 text-white"
                      : "bg-lacquer-red/90 text-white"
                    : isDark
                      ? "bg-white/10 backdrop-blur-md"
                      : "bg-white/80 backdrop-blur-md border border-gray-200/50",
                )}
              >
                {message.text}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div
                className={cn(
                  "p-3 rounded-2xl backdrop-blur-md",
                  isDark ? "bg-white/10" : "bg-white/80 border border-gray-200/50",
                )}
              >
                <div className="flex space-x-1">
                  <div
                    className={cn("w-2 h-2 rounded-full animate-bounce", isDark ? "bg-white/60" : "bg-gray-600/60")}
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className={cn("w-2 h-2 rounded-full animate-bounce", isDark ? "bg-white/60" : "bg-gray-600/60")}
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className={cn("w-2 h-2 rounded-full animate-bounce", isDark ? "bg-white/60" : "bg-gray-600/60")}
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className={cn("p-4 border-t", isDark ? "border-white/10" : "border-gray-200/50")}>
          <form onSubmit={handleSubmit} className="flex items-center">
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={cn(
                "flex-1",
                isDark
                  ? "bg-white/10 border-white/20 focus-visible:ring-lacquer-red/50 text-white placeholder:text-white/60"
                  : "bg-white/60 border-gray-200/50 focus-visible:ring-lacquer-red/30 text-gray-800 placeholder:text-gray-600/60",
              )}
            />
            <Button type="submit" size="icon" className="bg-lacquer-red hover:bg-lacquer-red/90 ml-2">
              <Send className="h-4 w-4 text-white" />
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
