"use client"

import { useState, useMemo } from "react"
import { type Beach } from "@/lib/wave-data"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface WaveChartProps {
  beach: Beach
}

export function WaveChart({ beach }: WaveChartProps) {
  const [selectedDay, setSelectedDay] = useState(0)

  const days = useMemo(() => {
    const unique: { label: string; index: number }[] = []
    const seen = new Set<number>()
    for (const entry of beach.forecast) {
      if (!seen.has(entry.dayIndex)) {
        seen.add(entry.dayIndex)
        unique.push({ label: entry.dayLabel, index: entry.dayIndex })
      }
    }
    return unique
  }, [beach.forecast])

  const filteredData = useMemo(() => {
    return beach.forecast
      .filter((entry) => entry.dayIndex === selectedDay)
      .map((entry) => ({
        hour: entry.hour,
        ondas: entry.waveHeight,
        vento: entry.windSpeed,
      }))
  }, [beach.forecast, selectedDay])

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-mono font-bold text-card-foreground mb-1">
        Grafico de Ondas
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Selecione um dia para ver a evolucao das ondas
      </p>

      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {days.map((day) => (
          <button
            key={day.index}
            onClick={() => setSelectedDay(day.index)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              selectedDay === day.index
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.45 0.15 220)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.45 0.15 220)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 220)" />
            <XAxis
              dataKey="hour"
              tick={{ fill: "oklch(0.5 0.03 220)", fontSize: 12 }}
              axisLine={{ stroke: "oklch(0.9 0.02 220)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "oklch(0.5 0.03 220)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              unit="m"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.995 0.002 220)",
                border: "1px solid oklch(0.9 0.02 220)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              labelStyle={{ fontWeight: "bold", color: "oklch(0.15 0.02 230)" }}
            />
            <Area
              type="monotone"
              dataKey="ondas"
              stroke="oklch(0.45 0.15 220)"
              strokeWidth={2.5}
              fill="url(#waveGradient)"
              name="Altura (m)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
