"use client"

import { useState } from "react"
import { Waves, Menu, X } from "lucide-react"
import Link from "next/link"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 p-1.5">
            <Waves className="h-6 w-6 text-primary" />
          </span>
          <span className="text-xl font-mono font-bold tracking-tight text-foreground">OndaViva</span>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-border/80 bg-card/70 p-1 md:flex">
          {[
            ["#previsao", "Previsao"],
            ["#praias", "Praias"],
            ["#mares", "Mares"],
            ["#sobre", "Sobre"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          className="rounded-md p-1 text-foreground md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/70 bg-background/95 px-4 py-4 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              href="#previsao"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Previsao
            </Link>
            <Link
              href="#praias"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Praias
            </Link>
            <Link
              href="#mares"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mares
            </Link>
            <Link
              href="#sobre"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
