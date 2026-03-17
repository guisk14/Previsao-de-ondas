"use client"

import { useMemo, useState } from "react"
import { type Beach } from "@/lib/wave-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface ForecastTableProps {
  beach: Beach
}

export function ForecastTable({ beach }: ForecastTableProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)

  const days = useMemo(() => {
    const uniqueDays: { label: string; index: number }[] = []
    const seen = new Set()
    
    beach.forecast.forEach((entry) => {
      if (!seen.has(entry.dayIndex)) {
        seen.add(entry.dayIndex)
        uniqueDays.push({ label: entry.dayLabel, index: entry.dayIndex })
      }
    })
    
    return uniqueDays.slice(0, 5)
  }, [beach.forecast])

  const filteredForecast = useMemo(() => {
    return beach.forecast.filter((entry) => entry.dayIndex === selectedDayIndex)
  }, [beach.forecast, selectedDayIndex])

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Header com Título e Seletores */}
      <div className="px-5 py-5 border-b border-border bg-muted/30">
        <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Previsão Detalhada de Ondas (Diário)
        </h3>
        
        {/* Seletores de Dia com Estilo OndaViva */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {days.map((day) => {
            const [name, date] = day.label.split(" ")
            const isSelected = selectedDayIndex === day.index
            
            return (
              <button
                key={day.index}
                onClick={() => setSelectedDayIndex(day.index)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[70px] py-2.5 rounded-lg border transition-all duration-200",
                  isSelected 
                    ? "bg-primary border-primary text-primary-foreground shadow-md" 
                    : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                <span className="text-[10px] font-mono font-bold uppercase tracking-tighter mb-0.5">{name}</span>
                <span className="text-base font-mono font-bold">{date.replace("(", "").replace(")", "")}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tabela de Previsão com Estilo OndaViva */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground h-10 px-6">Hora</TableHead>
              <TableHead className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground h-10">Altura</TableHead>
              <TableHead className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground h-10">Período (s)</TableHead>
              <TableHead className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground h-10">Dir.</TableHead>
              <TableHead className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground h-10 pr-6">Vento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredForecast.map((entry, idx) => (
              <TableRow
                key={`${entry.dayIndex}-${entry.hour}`}
                className={cn(
                  "border-border transition-colors",
                  idx % 2 === 0 ? "bg-background" : "bg-muted/20",
                  "hover:bg-primary/5"
                )}
              >
                <TableCell className="font-mono text-sm font-bold text-foreground px-6 py-3.5">
                  {entry.hour.replace("h", ":00")}
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "font-mono text-sm font-bold",
                    entry.waveHeight >= 1.5 ? "text-primary" : "text-accent"
                  )}>
                    {entry.waveHeight.toFixed(1)} m
                  </span>
                </TableCell>
                <TableCell className="font-mono text-sm text-foreground/80">
                  {entry.wavePeriod.toFixed(1)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground font-medium">
                  {entry.waveDirection}
                </TableCell>
                <TableCell className="pr-6">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-foreground/90">
                      {entry.windSpeed} <span className="text-[10px] text-muted-foreground">km/h</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-primary/70">{entry.windDirection}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
