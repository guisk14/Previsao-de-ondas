"use client"

import { useState, useCallback, useMemo } from "react"
import { type Beach, type ForecastHour } from "@/lib/wave-data"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface WaveChartProps {
  beach: Beach
}

export function WaveChart({ beach }: WaveChartProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const forecast = beach.forecast
  const activeEntry = forecast[activeIndex] ?? forecast[0]

  const dayBoundaries = useMemo(() => {
    const boundaries: { index: number; label: string }[] = []
    let lastDay = ""
    forecast.forEach((entry, idx) => {
      if (entry.dayLabel !== lastDay) {
        boundaries.push({ index: idx, label: entry.dayLabel })
        lastDay = entry.dayLabel
      }
    })
    return boundaries
  }, [forecast])

  const handleMouseMove = useCallback(
    (state: { activeTooltipIndex?: number }) => {
      if (state?.activeTooltipIndex !== undefined && state.activeTooltipIndex >= 0) {
        setActiveIndex(state.activeTooltipIndex)
      }
    },
    []
  )

  const data = forecast.map((entry, idx) => ({
    idx,
    waveHeight: entry.waveHeight,
    hour: entry.hour,
    dayLabel: entry.dayLabel,
  }))

  const conditionCards = [
    {
      label: "ALTURA SIGNIFICATIVA",
      value: `${activeEntry.waveHeight}`,
      unit: "m",
      highlight: true,
    },
    {
      label: "PERIODO DE PICO",
      value: `${activeEntry.wavePeriod}`,
      unit: "s",
      highlight: true,
    },
    {
      label: "DIRECAO DE PICO",
      value: activeEntry.waveDirection,
      unit: "",
      highlight: true,
    },
    {
      label: "VENTO",
      value: `${activeEntry.windSpeed}`,
      unit: "km/h",
      highlight: false,
    },
    {
      label: "DIRECAO",
      value: activeEntry.windDirection,
      unit: "",
      highlight: false,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-[oklch(0.18_0.025_225)] border border-[oklch(0.28_0.02_225)] p-4 md:p-6">
        <p className="text-sm text-[oklch(0.55_0.03_220)] mb-4">
          Arraste/mova no grafico para atualizar os dados abaixo
        </p>

        {/* Day headers */}
        <div className="flex border-b border-[oklch(0.28_0.02_225)] mb-2">
          {dayBoundaries.map((boundary) => (
            <button
              key={boundary.label}
              className="flex-1 py-2 text-center text-sm font-mono font-bold text-[oklch(0.85_0.01_220)] hover:text-[oklch(0.95_0.01_220)] transition-colors"
              onClick={() => setActiveIndex(boundary.index)}
            >
              {boundary.label}
            </button>
          ))}
        </div>

        {/* Chart area */}
        <div className="h-48 md:h-56 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              onMouseMove={handleMouseMove as unknown as (state: unknown) => void}
            >
              <defs>
                <linearGradient id="waveAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.5 0.14 210)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.5 0.14 210)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="idx" hide />
              <YAxis
                tick={{ fill: "oklch(0.45 0.02 220)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={35}
                unit="m"
              />
              {/* Day separator lines */}
              {dayBoundaries.slice(1).map((boundary) => (
                <ReferenceLine
                  key={boundary.index}
                  x={boundary.index}
                  stroke="oklch(0.3 0.02 225)"
                  strokeDasharray="3 3"
                />
              ))}
              {/* Active cursor line */}
              <ReferenceLine
                x={activeIndex}
                stroke="oklch(0.95 0.01 220)"
                strokeWidth={1.5}
                label={{
                  value: activeEntry.hour,
                  position: "top",
                  fill: "oklch(0.95 0.01 220)",
                  fontSize: 12,
                  fontWeight: "bold",
                  offset: 8,
                }}
              />
              <Area
                type="monotone"
                dataKey="waveHeight"
                stroke="oklch(0.55 0.14 210)"
                strokeWidth={2}
                fill="url(#waveAreaGradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Condition cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {conditionCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl bg-[oklch(0.18_0.025_225)] border border-[oklch(0.28_0.02_225)] p-4 flex flex-col items-center justify-center gap-1 text-center"
          >
            <span
              className={`text-[10px] md:text-xs font-mono uppercase tracking-wider ${
                card.highlight
                  ? "text-[oklch(0.6_0.14_210)]"
                  : "text-[oklch(0.55_0.03_220)]"
              }`}
            >
              {card.label}
            </span>
            <span className="text-2xl md:text-3xl font-mono font-bold text-[oklch(0.95_0.01_220)]">
              {card.value}
            </span>
            {card.unit && (
              <span className="text-xs text-[oklch(0.55_0.03_220)]">
                {card.unit}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
