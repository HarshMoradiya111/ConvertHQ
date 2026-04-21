"use client"

import * as React from "react"
import { Search, History, Settings, FileText, ArrowRight, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { TOOLS, Tool } from "@/lib/tools-config"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function GlobalSearch() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<{ tools: Tool[]; history: any[] }>({ tools: [], history: [] })
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const searchRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (query.length < 2) {
      setResults({ tools: [], history: [] })
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      
      // Search Tools
      const filteredTools = TOOLS.filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.keywords.some(k => k.includes(query.toLowerCase()))
      )

      // Search History
      const supabase = createClient()
      const { data: history } = await supabase
        .from("conversions")
        .select("*")
        .ilike("filename", `%${query}%`)
        .limit(5)

      setResults({ tools: filteredTools, history: history || [] })
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (href: string) => {
    router.push(href)
    setIsOpen(false)
    setQuery("")
  }

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setIsOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search tools...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-0 flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4">
        <div 
          ref={searchRef}
          className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in duration-200"
        >
          <div className="flex items-center border-b border-border px-4 py-3">
            <Search className="h-5 w-5 text-muted-foreground mr-3" />
            <input
              autoFocus
              placeholder="Search tools, history, or formats..."
              className="flex-1 bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="ghost" size="icon" className="h-8 w-8 ml-2" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {query.length < 2 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Type at least 2 characters to search...</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["PDF", "Image", "History", "Resize"].map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setQuery(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : results.tools.length === 0 && results.history.length === 0 && !isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                No results found for "{query}"
              </div>
            ) : (
              <div className="space-y-4 p-2">
                {results.tools.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase tracking-wider">Tools</h3>
                    {results.tools.map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => handleSelect(tool.href)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center mr-3">
                            <Settings className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{tool.name}</div>
                            <div className="text-xs text-muted-foreground">{tool.description}</div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                )}

                {results.history.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase tracking-wider">Recent Conversions</h3>
                    {results.history.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect("/dashboard/history")}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center mr-3">
                            <History className="h-4 w-4 text-secondary-foreground" />
                          </div>
                          <div>
                            <div className="text-sm font-medium truncate max-w-[300px]">{item.filename}</div>
                            <div className="text-xs text-muted-foreground uppercase">{item.from_format} → {item.to_format}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px]">History</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-muted/50 px-4 py-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span><kbd className="border bg-background px-1 rounded">↵</kbd> Select</span>
              <span><kbd className="border bg-background px-1 rounded">↑↓</kbd> Navigate</span>
              <span><kbd className="border bg-background px-1 rounded">ESC</kbd> Close</span>
            </div>
            <div>
              ConvertHQ Global Search
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
