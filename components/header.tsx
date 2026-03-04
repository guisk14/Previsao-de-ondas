"use client"

import { useState } from "react"
import { Waves, Menu, X } from "lucide-react"
import Link from "next/link"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Waves className="h-7 w-7 text-primary" />
          <span className="text-xl font-mono font-bold tracking-tight text-foreground">
            OndaViva
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#previsao" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Previsao
          </Link>
          <Link href="#praias" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Praias
          </Link>
          <Link href="#mares" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Mares
          </Link>
          <Link href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sobre
          </Link>
        </nav>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="flex flex-col px-4 py-4 gap-3">
            <Link href="#previsao" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Previsao
            </Link>
            <Link href="#praias" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Praias
            </Link>
            <Link href="#mares" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Mares
            </Link>
            <Link href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Sobre
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
