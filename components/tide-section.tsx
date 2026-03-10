"use client"

import { ArrowUp, ArrowDown } from "lucide-react"
import { useTides } from "@/hooks/use-tides"

export function TideSection() {
  const { tides, loading } = useTides()

  if (loading) {
    return (
      <section id="mares" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Mares
          </p>
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-foreground text-balance mb-8">
            Tabela de Mares de Hoje
          </h2>
          <div className="text-muted-foreground">Carregando dados de mares...</div>
        </div>
      </section>
    )
  }

  if (tides.length === 0) {
    return (
      <section id="mares" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Mares
          </p>
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-foreground text-balance mb-8">
            Tabela de Mares de Hoje
          </h2>
          <div className="text-muted-foreground">Sem dados de mares para hoje.</div>
        </div>
      </section>
    )
  }
  return (
    <section id="mares" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-2">
          Mares
        </p>
        <h2 className="text-3xl md:text-4xl font-mono font-bold text-foreground text-balance mb-8">
          Tabela de Mares de Hoje
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tides.map((tide, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border p-5 flex flex-col items-center gap-3"
            >
              <div className={`p-2.5 rounded-full ${
                tide.type === "alta" ? "bg-primary/10" : "bg-accent/10"
              }`}>
                {tide.type === "alta" ? (
                  <ArrowUp className="h-5 w-5 text-primary" />
                ) : (
                  <ArrowDown className="h-5 w-5 text-accent" />
                )}
              </div>
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Mare {tide.type === "alta" ? "Alta" : "Baixa"}
              </span>
              <span className="text-2xl font-mono font-bold text-card-foreground">
                {tide.time}
              </span>
              <span className="text-sm text-muted-foreground">
                {tide.height}m
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
