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

interface WindDirectionTableProps {
  beach: Beach
}

export function WindDirectionTable({ beach }: WindDirectionTableProps) {
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

  // Lógica simplificada para classificação de vento baseada na direção predominante das praias de Santos/Guarujá (Sul/Sudeste)
  const getWindType = (direction: string, speed: number) => {
    const dir = direction.toUpperCase()
    let type = ""
    let color = ""

    // Terral: Ventos que sopram da terra para o mar (N, NO, NE)
    if (dir.includes("N") || dir === "NO" || dir === "NE") {
      type = "TERRAL"
      color = "text-emerald-500"
    } 
    // Maral: Ventos que sopram do mar para a terra (S, SE, SO)
    else if (dir.includes("S") || dir === "SE" || dir === "SO") {
      type = "MARAL"
      color = "text-rose-500"
    } 
    // Lateral: Ventos que sopram paralelos à costa (L, O)
    else {
      type = "LATERAL"
      color = "text-amber-500"
    }

    const intensity = speed > 15 ? "MODERADO" : "FRACO"
    
    return { label: `${type} ${intensity}`, color }
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Header com Título e Seletores */}
      <div className="px-5 py-5 border-b border-border bg-muted/30">
        <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4">
          DIREÇÃO DO VENTO (MARAL / TERRAL) — <span className="text-primary">{beach.name.toUpperCase()}</span>
        </h3>
        
        {/* Seletores de Dia */}
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

      {/* Tabela de Vento */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground h-10 px-6">Hora</TableHead>
              <TableHead className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground h-10 text-center">Vento</TableHead>
              <TableHead className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground h-10 text-right pr-6">Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredForecast.map((entry, idx) => {
              const windInfo = getWindType(entry.windDirection, entry.windSpeed)
              return (
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
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-sm font-bold text-foreground">
                        {entry.windSpeed} <span className="text-[10px] text-muted-foreground">km/h</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold text-primary/70">{entry.windDirection}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <span className={cn("font-mono text-xs font-bold tracking-wider", windInfo.color)}>
                      {windInfo.label}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
