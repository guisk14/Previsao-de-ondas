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
    hora: entry.hour,
    "Altura (m)": entry.waveHeight,
    "Periodo (s)": entry.wavePeriod,
  }))

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="mb-4">
        <h3 className="font-mono font-bold text-card-foreground">
          Grafico de Ondas
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Altura e periodo ao longo do dia
        </p>
      </div>
      <div className="h-64 md:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="periodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="hora"
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid var(--border)",
                backgroundColor: "var(--card)",
                color: "var(--card-foreground)",
                fontSize: "0.875rem",
              }}
            />
            <Area
              type="monotone"
              dataKey="Altura (m)"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#waveGrad)"
            />
            <Area
              type="monotone"
              dataKey="Periodo (s)"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#periodGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
