"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-9">
        <Sun className="size-4" />
      </Button>
    )
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={cycleTheme}
      className="size-9 relative group overflow-hidden"
      title={`Current theme: ${theme}. Click to change.`}
    >
      <div className="flex flex-col transition-transform duration-300 ease-in-out" 
        style={{ transform: theme === "light" ? "translateY(0)" : theme === "dark" ? "translateY(-100%)" : "translateY(-200%)" }}
      >
        <div className="size-9 flex items-center justify-center shrink-0">
          <Sun className="size-4 text-amber-500" />
        </div>
        <div className="size-9 flex items-center justify-center shrink-0">
          <Moon className="size-4 text-indigo-400" />
        </div>
        <div className="size-9 flex items-center justify-center shrink-0">
          <Monitor className="size-4 text-slate-400" />
        </div>
      </div>
    </Button>
  )
}
