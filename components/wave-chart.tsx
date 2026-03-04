"use client"

import { useState, useCallback, useMemo } from "react"
import { type Beach } from "@/lib/wave-data"
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from "recharts"
import { Waves, Timer, Compass, Wind, Navigation } from "lucide-react"

interface InteractiveWaveChartProps {
  beach: Beach
}

export function InteractiveWaveChart({ beach }: InteractiveWaveChartProps) {
  const forecast = beach.forecast
  const [activeIndex, setActiveIndex] = useState(0)

  const data = useMemo(
    () =>
      forecast.map((entry, i) => ({
        index: i,
        label: entry.hour,
        ondas: entry.waveHeight,
        swell: entry.swellSecondary,
        vento: entry.windSpeed,
      })),
    [forecast]
  )

  // Build day boundary positions & labels
  const dayBoundaries = useMemo(() => {
    const boundaries: { index: number; label: string; startIndex: number; endIndex: number }[] = []
    let currentDay = ""
    let startIndex = 0
    for (let i = 0; i < forecast.length; i++) {
      if (forecast[i].dayLabel !== currentDay) {
        if (currentDay !== "") {
          boundaries[boundaries.length - 1].endIndex = i - 1
        }
        currentDay = forecast[i].dayLabel
        startIndex = i
        boundaries.push({ index: i, label: currentDay, startIndex, endIndex: forecast.length - 1 })
      }
    }
    return boundaries
  }, [forecast])

  const activeEntry = forecast[activeIndex]
  const activeDay = activeEntry?.dayLabel ?? ""
  const activeHour = activeEntry?.hour ?? ""

  const handleMouseMove = useCallback(
    (state: { activeTooltipIndex?: number }) => {
      if (state?.activeTooltipIndex != null) {
        setActiveIndex(state.activeTooltipIndex)
      }
    },
    []
  )

  // Scale wind to fit chart area (secondary Y axis visual only)
  const maxWave = Math.max(...data.map((d) => d.swell), 3)
  const maxWind = Math.max(...data.map((d) => d.vento), 30)
  const windScale = maxWave / maxWind

  const scaledData = useMemo(
    () => data.map((d) => ({ ...d, ventoScaled: d.vento * windScale })),
    [data, windScale]
  )

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Day headers */}
      <div className="flex border-b border-border">
        {dayBoundaries.map((day) => {
          const width = ((day.endIndex - day.startIndex + 1) / forecast.length) * 100
          const isActive = activeDay === day.label
          return (
            <div
              key={day.label}
              className={`text-center py-2.5 text-sm font-mono font-semibold border-r border-border last:border-r-0 transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
              style={{ width: `${width}%` }}
            >
              {day.label}
            </div>
          )
        })}
      </div>

      {/* Selected time label */}
      <div className="px-5 pt-4 pb-1">
        <p className="text-sm text-muted-foreground font-mono">
          {activeDay} - {activeHour}
        </p>
      </div>

      {/* Chart */}
      <div className="h-56 w-full px-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={scaledData}
            margin={{ top: 8, right: 8, left: -30, bottom: 0 }}
            onMouseMove={handleMouseMove}
          >
            <defs>
              <linearGradient id="swellGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.75 0.1 210)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="oklch(0.75 0.1 210)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.55 0.15 210)" stopOpacity={0.7} />
                <stop offset="100%" stopColor="oklch(0.55 0.15 210)" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <XAxis dataKey="label" hide />
            <YAxis hide domain={[0, maxWave * 1.2]} />

            {/* Day boundary lines */}
            {dayBoundaries.slice(1).map((day) => (
              <ReferenceLine
                key={`line-${day.index}`}
                x={day.index}
                stroke="oklch(0.85 0.02 220)"
                strokeWidth={1}
              />
            ))}

            {/* Cursor line */}
            <ReferenceLine
              x={activeIndex}
              stroke="oklch(0.25 0.02 230)"
              strokeWidth={1.5}
            />

            {/* Secondary swell (gray/light) */}
            <Area
              type="monotone"
              dataKey="swell"
              stroke="oklch(0.8 0.02 220)"
              strokeWidth={0}
              fill="url(#swellGradient)"
              isAnimationActive={false}
            />

            {/* Primary swell (blue) */}
            <Area
              type="monotone"
              dataKey="ondas"
              stroke="oklch(0.55 0.15 210)"
              strokeWidth={1}
              fill="url(#waveGradient)"
              isAnimationActive={false}
            />

            {/* Wind line (red) */}
            <Line
              type="monotone"
              dataKey="ventoScaled"
              stroke="oklch(0.6 0.2 25)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Condition cards below */}
      <div className="grid grid-cols-5 border-t border-border">
        <StatCard
          icon={<Waves className="h-4 w-4" />}
          label="Altura Significativa"
          value={`${activeEntry?.waveHeight ?? 0}`}
          unit="m"
          accent
        />
        <StatCard
          icon={<Timer className="h-4 w-4" />}
          label="Periodo de Pico"
          value={`${activeEntry?.wavePeriod ?? 0}`}
          unit="s"
          accent
        />
        <StatCard
          icon={<Navigation className="h-4 w-4" />}
          label="Direcao de Pico"
          value={activeEntry?.waveDirection ?? "-"}
          accent
        />
        <StatCard
          icon={<Wind className="h-4 w-4" />}
          label="Vento"
          value={`${activeEntry?.windSpeed ?? 0}`}
          unit="km/h"
        />
        <StatCard
          icon={<Compass className="h-4 w-4" />}
          label="Direcao"
          value={activeEntry?.windDirection ?? "-"}
        />
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  unit,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  unit?: string
  accent?: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 border-r border-border last:border-r-0 text-center gap-1">
      <div className="flex items-center gap-1.5">
        <span className={accent ? "text-primary" : "text-muted-foreground"}>{icon}</span>
        <span className={`text-[10px] uppercase tracking-wider font-semibold ${accent ? "text-primary" : "text-muted-foreground"}`}>
          {label}
        </span>
      </div>
      <span className="text-2xl font-mono font-bold text-card-foreground">{value}</span>
      {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
    </div>
  )
}
