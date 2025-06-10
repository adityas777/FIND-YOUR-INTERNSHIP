import { Briefcase, Github, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 md:p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
              <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              JobMatcher
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-800/50 hidden md:flex"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800/50">
              <Linkedin className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">LinkedIn</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
