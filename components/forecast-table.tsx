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
    
    return uniqueDays.slice(0, 5) // Mostra apenas os próximos 5 dias
  }, [beach.forecast])

  const filteredForecast = useMemo(() => {
    return beach.forecast.filter((entry) => entry.dayIndex === selectedDayIndex)
  }, [beach.forecast, selectedDayIndex])

  return (
    <div className="bg-[#121212] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Header com Título */}
      <div className="px-6 py-5 border-b border-white/5">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
          Previsão Detalhada de Ondas (Diário)
        </h3>
        
        {/* Seletores de Dia */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {days.map((day) => {
            const [name, date] = day.label.split(" ")
            const isSelected = selectedDayIndex === day.index
            
            return (
              <button
                key={day.index}
                onClick={() => setSelectedDayIndex(day.index)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[80px] py-3 rounded-xl transition-all duration-200",
                  isSelected 
                    ? "bg-[#0099ff] text-white shadow-[0_0_20px_rgba(0,153,255,0.3)]" 
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider mb-1">{name}</span>
                <span className="text-lg font-bold">{date.replace("(", "").replace(")", "")}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tabela de Previsão */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-white/20 h-12 px-6">Hora</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-white/20 h-12">Altura</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-white/20 h-12">Período (s)</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-white/20 h-12">Dir.</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-white/20 h-12 pr-6">Vento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredForecast.map((entry, idx) => (
              <TableRow
                key={`${entry.dayIndex}-${entry.hour}`}
                className={cn(
                  "border-white/5 transition-colors",
                  idx % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent",
                  "hover:bg-white/[0.05]"
                )}
              >
                <TableCell className="font-mono text-sm font-medium text-white/90 px-6 py-4">
                  {entry.hour.replace("h", ":00")}
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm font-bold text-[#0099ff]">
                    {entry.waveHeight.toFixed(1)} m
                  </span>
                </TableCell>
                <TableCell className="font-mono text-sm text-white/70">
                  {entry.wavePeriod.toFixed(1)}
                </TableCell>
                <TableCell className="text-sm text-white/70">
                  {entry.waveDirection}
                </TableCell>
                <TableCell className="pr-6">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-white/90">
                      {entry.windSpeed} <span className="text-[10px] text-white/40">km/h</span>
                    </span>
                    <span className="text-[10px] font-bold text-white/40">{entry.windDirection}</span>
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
