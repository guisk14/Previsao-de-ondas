"use client"

import { useMemo } from "react"
import { type Beach } from "@/lib/wave-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ForecastTableProps {
  beach: Beach
}

export function ForecastTable({ beach }: ForecastTableProps) {
  const todayForecast = useMemo(() => {
    return beach.forecast.filter((entry) => entry.dayIndex === 0)
  }, [beach.forecast])

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-mono font-bold text-card-foreground">
          Previsao Horaria — {beach.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Condicoes de hoje para {beach.name}
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card">
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
            {todayForecast.map((entry, index) => (
              <TableRow
                key={index}
                className="border-border hover:bg-secondary/50 transition-colors"
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
