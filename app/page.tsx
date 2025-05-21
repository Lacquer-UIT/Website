import { AnimatedBackground } from "@/components/animated-background"
import { HeroTypography } from "@/components/hero-typography"
import { Chatbot } from "@/components/chatbot"
import { Header } from "@/components/header"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <>
      <Header />
      <main
        className={cn(
          "relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden",
          "bg-gradient-to-b dark:from-gray-900 dark:to-black light:from-[#f8f4e9] light:to-white",
        )}
      >
        <AnimatedBackground />
        <div className="z-10 flex flex-col items-center justify-center gap-12 w-full max-w-5xl">
          <HeroTypography />
          <Chatbot />
        </div>
      </main>
    </>
  )
}
