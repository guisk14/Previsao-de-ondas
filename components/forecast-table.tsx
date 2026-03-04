"use client"

import { useState } from "react"
import { type Beach } from "@/lib/wave-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronDown, ChevronRight } from "lucide-react"

interface ForecastTableProps {
  beach: Beach
}

export function ForecastTable({ beach }: ForecastTableProps) {
  // Group forecast by day
  const dayGroups = beach.forecast.reduce<Record<string, typeof beach.forecast>>((acc, entry) => {
    const key = entry.dayLabel
    if (!acc[key]) acc[key] = []
    acc[key].push(entry)
    return acc
  }, {})

  const dayLabels = Object.keys(dayGroups)

  // First day open by default
  const [openDays, setOpenDays] = useState<Set<string>>(new Set([dayLabels[0]]))

  const toggleDay = (day: string) => {
    setOpenDays((prev) => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-mono font-bold text-card-foreground">
          Previsao Horaria — {beach.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Dados de swell, vento e temperatura por dia
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground font-medium">Hora</TableHead>
              <TableHead className="text-muted-foreground font-medium">Ondas (m)</TableHead>
              <TableHead className="text-muted-foreground font-medium">Periodo (s)</TableHead>
              <TableHead className="text-muted-foreground font-medium">Dir. Ondas</TableHead>
              <TableHead className="text-muted-foreground font-medium">Vento (km/h)</TableHead>
              <TableHead className="text-muted-foreground font-medium">Dir. Vento</TableHead>
              <TableHead className="text-muted-foreground font-medium">Temp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dayLabels.map((dayLabel) => {
              const isOpen = openDays.has(dayLabel)
              const entries = dayGroups[dayLabel]
              return (
                <>
                  <TableRow
                    key={`day-${dayLabel}`}
                    className="border-border bg-secondary/40 cursor-pointer hover:bg-secondary/70 transition-colors"
                    onClick={() => toggleDay(dayLabel)}
                  >
                    <TableCell colSpan={7} className="py-2.5">
                      <div className="flex items-center gap-2">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="font-mono font-bold text-card-foreground text-sm">
                          {dayLabel}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({entries.length} registros)
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isOpen &&
                    entries.map((entry, i) => (
                      <TableRow
                        key={`${dayLabel}-${i}`}
                        className="border-border hover:bg-secondary/30 transition-colors"
                      >
                        <TableCell className="font-mono font-medium text-card-foreground">
                          {entry.hour}
                        </TableCell>
                        <TableCell>
                          <span className={`font-mono font-bold ${getWaveColor(entry.waveHeight)}`}>
                            {entry.waveHeight}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-card-foreground">{entry.wavePeriod}</TableCell>
                        <TableCell className="text-muted-foreground">{entry.waveDirection}</TableCell>
                        <TableCell>
                          <span className={`font-mono ${getWindColor(entry.windSpeed)}`}>
                            {entry.windSpeed}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{entry.windDirection}</TableCell>
                        <TableCell className="font-mono text-card-foreground">{entry.temperature}°C</TableCell>
                      </TableRow>
                    ))}
                </>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function getWaveColor(height: number): string {
  if (height >= 2.5) return "text-destructive"
  if (height >= 1.5) return "text-chart-4"
  if (height >= 1.0) return "text-chart-2"
  return "text-chart-3"
}

function getWindColor(speed: number): string {
  if (speed >= 25) return "text-destructive"
  if (speed >= 18) return "text-chart-4"
  return "text-card-foreground"
}
