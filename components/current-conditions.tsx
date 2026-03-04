"use client"

import { useState, useEffect } from "react"
import { Waves, Wind, Timer, Star, ArrowUp, ArrowDown } from "lucide-react"
import { type Beach, getRatingLabel, getRatingColor, tides } from "@/lib/wave-data"

interface CurrentConditionsProps {
  beach: Beach
}

function getNextTide() {
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  for (const tide of tides) {
    const [h, m] = tide.time.split(":").map(Number)
    if (h * 60 + m > nowMinutes) {
      return tide
    }
  }
  return tides[0]
}

export function CurrentConditions({ beach }: CurrentConditionsProps) {
  const [nextTide, setNextTide] = useState(tides[0])

  useEffect(() => {
    setNextTide(getNextTide())
  }, [])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <ConditionCard
        icon={<Waves className="h-5 w-5 text-primary" />}
        label="Altura"
        value={`${beach.currentWaveHeight}m`}
      />
      <ConditionCard
        icon={<Timer className="h-5 w-5 text-primary" />}
        label="Periodo"
        value={`${beach.currentPeriod}s`}
      />
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col items-center justify-center gap-2 text-center">
        <Wind className="h-5 w-5 text-primary" />
        <span className="text-xs text-muted-foreground">Vento</span>
        <span className="text-lg font-mono font-bold text-card-foreground">
          {beach.currentWind} km/h
        </span>
        <span className="text-xs text-muted-foreground">{beach.windDirection}</span>
      </div>
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col items-center justify-center gap-2 text-center">
        {nextTide.type === "alta" ? (
          <ArrowUp className="h-5 w-5 text-primary" />
        ) : (
          <ArrowDown className="h-5 w-5 text-accent" />
        )}
        <span className="text-xs text-muted-foreground">
          Proxima Mare {nextTide.type === "alta" ? "Alta" : "Baixa"}
        </span>
        <span className="text-lg font-mono font-bold text-card-foreground">
          {nextTide.time}
        </span>
        <span className="text-xs text-muted-foreground">{nextTide.height}m</span>
      </div>
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col items-center justify-center gap-2 col-span-2 sm:col-span-1">
        <Star className="h-5 w-5 text-chart-4" />
        <span className="text-xs text-muted-foreground">Condicoes</span>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getRatingColor(beach.rating)}`}>
          {getRatingLabel(beach.rating)}
        </span>
      </div>
    </div>
  )
}

function ConditionCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex flex-col items-center justify-center gap-2 text-center">
      {icon}
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-mono font-bold text-card-foreground">{value}</span>
    </div>
  )
}
