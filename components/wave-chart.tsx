"use client"

import { type Beach } from "@/lib/wave-data"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface WaveChartProps {
  beach: Beach
}

export function WaveChart({ beach }: WaveChartProps) {
  const data = beach.forecast.map((entry) => ({
    hour: entry.hour,
    ondas: entry.waveHeight,
    vento: entry.windSpeed,
  }))

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-mono font-bold text-card-foreground mb-1">
        Grafico de Ondas
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Evolucao da altura das ondas ao longo do dia
      </p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
