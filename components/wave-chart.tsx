"use client"

import { useMemo } from "react"
import { type Beach } from "@/lib/wave-data"
import { ArrowUp, ArrowDown, ArrowUpRight, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpLeft, ArrowDownLeft } from "lucide-react"
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

const DIRECTION_ICONS: Record<string, React.ReactNode> = {
  "N": <ArrowUp className="h-4 w-4" />,
  "S": <ArrowDown className="h-4 w-4" />,
  "E": <ArrowRight className="h-4 w-4" />,
  "O": <ArrowLeft className="h-4 w-4" />,
  "NE": <ArrowUpRight className="h-4 w-4" />,
  "NO": <ArrowUpLeft className="h-4 w-4" />,
  "SE": <ArrowDownRight className="h-4 w-4" />,
  "SO": <ArrowDownLeft className="h-4 w-4" />,
}

export function WaveChart({ beach }: WaveChartProps) {
  const { chartData, dayBoundaries } = useMemo(() => {
    const data = beach.forecast.map((entry, i) => ({
      index: i,
      label: `${entry.dayLabel.split(" ")[0]} ${entry.hour}`,
      shortLabel: entry.hour,
      dayLabel: entry.dayLabel,
      dayIndex: entry.dayIndex,
      ondas: entry.waveHeight,
      vento: entry.windSpeed,
    }))

    // Find first index of each day for day header labels and reference lines
    const boundaries: { index: number; label: string }[] = []
    let lastDay = -1
    for (const d of data) {
      if (d.dayIndex !== lastDay) {
        lastDay = d.dayIndex
        boundaries.push({ index: d.index, label: d.dayLabel })
      }
    }

    return { chartData: data, dayBoundaries: boundaries }
  }, [beach.forecast])

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-mono font-bold text-card-foreground mb-1">
        Grafico de Ondas
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Previsao de 5 dias — altura das ondas (m)
      </p>

      {/* Day headers */}
      <div className="flex mb-2 border-b border-border">
        {dayBoundaries.map((day, i) => (
          <div
            key={day.index}
            className="flex-1 text-center py-1.5 text-xs font-mono font-bold text-primary border-r border-border last:border-r-0"
          >
            {day.label}
          </div>
        ))}
      </div>

      <div className="h-56 md:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 5, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="waveGrad5d" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.55 0.12 190)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="oklch(0.55 0.12 190)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.9 0.02 220)"
              vertical={false}
            />
            <XAxis
              dataKey="index"
              tick={({ x, y, payload }) => {
                const entry = chartData[payload.value]
                if (!entry) return <g />
                if (entry.shortLabel !== "00h" && entry.shortLabel !== "12h") {
                  return <g />
                }
                return (
                  <text
                    x={x}
                    y={y + 14}
                    textAnchor="middle"
                    fill="oklch(0.5 0.03 220)"
                    fontSize={10}
                  >
                    {entry.shortLabel}
                  </text>
                )
              }}
              axisLine={{ stroke: "oklch(0.9 0.02 220)" }}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fill: "oklch(0.5 0.03 220)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              unit="m"
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.995 0.002 220)",
                border: "1px solid oklch(0.9 0.02 220)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelFormatter={(value) => {
                const entry = chartData[value as number]
                return entry ? `${entry.dayLabel} - ${entry.shortLabel}` : ""
              }}
              formatter={(value: number, name: string) => {
                if (name === "ondas") return [`${value} m`, "Altura"]
                return [value, name]
              }}
            />
            {/* Day separator lines */}
            {dayBoundaries.slice(1).map((day) => (
              <ReferenceLine
                key={`sep-${day.index}`}
                x={day.index}
                stroke="oklch(0.75 0.02 220)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            ))}
            <Area
              type="monotone"
              dataKey="ondas"
              stroke="oklch(0.45 0.15 220)"
              strokeWidth={2}
              fill="url(#waveGrad5d)"
              name="ondas"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
