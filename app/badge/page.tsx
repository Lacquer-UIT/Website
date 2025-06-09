import { Header } from "@/components/header"
import { cn } from "@/lib/utils"
import BadgeManagement from "@/components/badge-management"

export default function BadgePage() {
  return (
    <>
      <Header />
      <main
        className={cn(
          "pt-24 min-h-screen p-8",
          "bg-gradient-to-b dark:from-gray-900 dark:to-black dark:text-white light:from-[#f8f4e9] light:to-white light:text-gray-800",
        )}
      >
        <div className="max-w-6xl mx-auto">
          <BadgeManagement />
        </div>
      </main>
    </>
  )
}
