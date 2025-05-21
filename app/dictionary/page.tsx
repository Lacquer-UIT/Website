import { Header } from "@/components/header"
import { cn } from "@/lib/utils"

export default function DictionaryPage() {
  return (
    <>
      <Header />
      <main
        className={cn(
          "pt-20 min-h-screen p-8",
          "bg-gradient-to-b dark:from-gray-900 dark:to-black dark:text-white light:from-[#f8f4e9] light:to-white light:text-gray-800",
        )}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-heading font-bold mb-6">Dictionary</h1>
          <p className="text-lg opacity-80">
            This page is under construction. The dictionary feature will allow you to explore Vietnamese language and
            cultural terms.
          </p>
        </div>
      </main>
    </>
  )
}
