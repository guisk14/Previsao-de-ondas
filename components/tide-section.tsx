"use client"

import { ArrowUp, ArrowDown } from "lucide-react"
import { useTides, type TideData } from "@/hooks/use-tides"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { useMemo } from "react"

function generateTideCurve(tides: TideData[]) {
  if (tides.length === 0) return []
  
  const points: { hour: number; height: number; label: string }[] = []
  
  // Gera pontos interpolados para criar uma curva suave de 00h a 24h
  for (let h = 0; h <= 24; h++) {
    const label = `${String(h === 24 ? 0 : h).padStart(2, '0')}h`
    
    // Interpola altura baseado nos horarios de mare
    let height = 0.7 // altura media
    
    for (let i = 0; i < tides.length; i++) {
      const [th] = tides[i].time.split(':').map(Number)
      const tideHeight = tides[i].height
      const prevTide = tides[i - 1] || { time: '00:00', height: 0.5, type: 'baixa' as const }
      const [ph] = prevTide.time.split(':').map(Number)
      
      if (h >= ph && h <= th) {
        const progress = (h - ph) / (th - ph || 1)
        // Curva senoidal suave
        const sinProgress = (1 - Math.cos(progress * Math.PI)) / 2
        height = prevTide.height + (tideHeight - prevTide.height) * sinProgress
        break
      } else if (h > th && i === tides.length - 1) {
        // Apos a ultima mare, volta para baixa
        const nextH = 24
        const progress = (h - th) / (nextH - th || 1)
        const sinProgress = (1 - Math.cos(progress * Math.PI)) / 2
        height = tideHeight + (0.5 - tideHeight) * sinProgress
      }
    }
    
    points.push({ hour: h, height, label })
  }
  
  return points
}

export function TideSection() {
  const { tides, loading, nextTide, currentHour } = useTides()
  
  const curveData = useMemo(() => generateTideCurve(tides), [tides])

  if (loading) {
    return (
      <section id="mares" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="text-muted-foreground">Carregando dados de mares...</div>
          </div>
        </div>
      </section>
    )
  }

  if (tides.length === 0) {
    return (
      <section id="mares" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="text-muted-foreground">Sem dados de mares para hoje.</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="mares" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="bg-card rounded-xl border border-border p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Mares
              </p>
              <h2 className="text-xl md:text-2xl font-mono font-bold text-card-foreground">
                Tabela de Mares de Hoje
              </h2>
            </div>
            {nextTide && (
              <div className="text-right">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Proxima
                </p>
                <p className="text-sm md:text-base font-mono font-bold text-primary">
                  Mare {nextTide.type === 'alta' ? 'Alta' : 'Baixa'} {nextTide.time}
                </p>
              </div>
            )}
          </div>

          {/* Grafico de curva de mare */}
          <div className="h-[140px] md:h-[180px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={curveData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.45 0.15 220)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="oklch(0.45 0.15 220)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'oklch(0.5 0.03 220)', fontSize: 10 }}
                  tickFormatter={(v) => `${String(v).padStart(2, '0')}h`}
                  ticks={[0, 6, 12, 18, 24]}
                />
                <YAxis hide domain={[0, 1.5]} />
                <Area
                  type="monotone"
                  dataKey="height"
                  stroke="oklch(0.45 0.15 220)"
                  strokeWidth={2}
                  fill="url(#tideGradient)"
                />
                <ReferenceLine
                  x={currentHour}
                  stroke="oklch(0.6 0.2 25)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Cards de mare */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tides.map((tide, index) => (
              <div
                key={index}
                className={`relative rounded-xl border p-4 flex flex-col items-center gap-2 transition-all ${
                  tide.isNext 
                    ? 'bg-primary/5 border-primary/30' 
                    : 'bg-background border-border'
                }`}
              >
                {tide.isNext && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Proxima
                  </span>
                )}
                <div className={`p-2 rounded-full border-2 ${
                  tide.type === "alta" 
                    ? "border-primary bg-primary/10" 
                    : "border-accent bg-accent/10"
                }`}>
                  {tide.type === "alta" ? (
                    <ArrowUp className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-accent" />
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Mare {tide.type === "alta" ? "Alta" : "Baixa"}
                </span>
                <span className="text-xl md:text-2xl font-mono font-bold text-card-foreground">
                  {tide.time}
                </span>
                <span className="text-sm text-muted-foreground">
                  {tide.height}m
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
