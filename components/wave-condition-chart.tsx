"use client"

import { useMemo, useState, useCallback } from "react"
import { type Beach } from "@/lib/wave-data"
import { 
  Waves, 
  Clock, 
  Navigation2, 
  Wind,
  ArrowUp, ArrowDown, ArrowUpRight, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpLeft, ArrowDownLeft 
} from "lucide-react"
import {
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from "recharts"
import { cn } from "@/lib/utils"

interface WaveConditionChartProps {
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

export function WaveConditionChart({ beach }: WaveConditionChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const { chartData, dayBoundaries } = useMemo(() => {
    const data = beach.forecast.map((entry, i) => ({
      index: i,
      hour: entry.hour,
      dayLabel: entry.dayLabel,
      dayIndex: entry.dayIndex,
      altura: entry.waveHeight,
      periodo: entry.wavePeriod,
      vento: entry.windSpeed,
      direcao: entry.waveDirection,
      windDir: entry.windDirection,
    }))

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

  const activeData = useMemo(() => {
    if (hoveredIndex !== null && chartData[hoveredIndex]) {
      return chartData[hoveredIndex]
    }
    return chartData[0]
  }, [chartData, hoveredIndex])

  const handleMouseMove = useCallback((state: any) => {
    if (state?.activeTooltipIndex !== undefined) {
      setHoveredIndex(state.activeTooltipIndex)
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null)
  }, [])

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Header Simplificado */}
      <div className="px-6 py-4 border-b border-border bg-muted/5">
        <div className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Condição das Ondas</h3>
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest ml-auto">
            Altura • Período • Vento
          </span>
        </div>
      </div>

      {/* Gráfico Unificado com Cabeçalhos de Dia */}
      <div className="p-4 bg-background/50">
        <div className="h-72 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 30, right: 0, left: -20, bottom: 0 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="colorAltura" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVento" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              
              {/* Eixo X com Dias e Horas Integrados */}
              <XAxis 
                dataKey="index" 
                axisLine={false} 
                tickLine={false} 
                tick={({ x, y, payload }) => {
                  const entry = chartData[payload.value]
                  if (!entry) return <g />
                  
                  // Mostrar nome do dia no topo (alinhado com 12h ou início do dia)
                  const isDayLabel = entry.hour === "12h"
                  const isHourLabel = entry.hour === "00h" || entry.hour === "12h"
                  
                  return (
                    <g>
                      {isDayLabel && (
                        <text x={x} y={-15} textAnchor="middle" fill="currentColor" className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                          {entry.dayLabel.split(" ")[0]} {entry.dayLabel.split(" ")[1].replace("(", "").replace(")", "")}
                        </text>
                      )}
                      {isHourLabel && (
                        <text x={x} y={y + 12} textAnchor="middle" fill="#94a3b8" fontSize={9} fontWeight="bold">
                          {entry.hour}
                        </text>
                      )}
                    </g>
                  )
                }}
                interval={0}
              />
              
              <YAxis hide domain={[0, 'dataMax + 2']} />
              <Tooltip cursor={{ stroke: '#ef4444', strokeWidth: 1 }} content={<></>} />
              
              {/* Linhas Divisórias de Dia */}
              {dayBoundaries.slice(1).map((day) => (
                <ReferenceLine
                  key={`sep-${day.index}`}
                  x={day.index}
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth={1}
                />
              ))}

              {/* Vento (Área Cinza ao Fundo) */}
              <Area
                type="monotone"
                dataKey="vento"
                stroke="none"
                fill="url(#colorVento)"
                yAxisId={0}
              />
              
              {/* Altura (Área Azul) */}
              <Area
                type="monotone"
                dataKey="altura"
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="url(#colorAltura)"
                dot={{ r: 0 }}
                activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
              />
              
              {/* Período (Linha Vermelha) */}
              <Line
                type="monotone"
                dataKey="periodo"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          
          {/* Legenda Customizada */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0ea5e9]" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Altura</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#94a3b8]" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Vento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Período</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé Detalhado */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border bg-muted/5">
        <div className="p-4 border-r border-border flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <Waves className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Altura</span>
          </div>
          <div className="text-xl font-mono font-bold text-foreground">
            {activeData.altura.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m</span>
          </div>
        </div>
        
        <div className="p-4 border-r border-border flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Período</span>
          </div>
          <div className="text-xl font-mono font-bold text-foreground">
            {activeData.periodo.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">s</span>
          </div>
        </div>

        <div className="p-4 border-r border-border flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <Navigation2 className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Direção</span>
          </div>
          <div className="flex items-center gap-1 text-xl font-mono font-bold text-foreground">
            <span className="text-primary">{DIRECTION_ICONS[activeData.direcao]}</span>
            {activeData.direcao}
          </div>
        </div>

        <div className="p-4 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <Wind className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Vento</span>
          </div>
          <div className="flex items-center gap-1 text-xl font-mono font-bold text-foreground">
            <span className="text-muted-foreground">{DIRECTION_ICONS[activeData.windDir]}</span>
            {activeData.vento} <span className="text-[10px] font-normal text-muted-foreground ml-1">{activeData.windDir}</span>
          </div>
        </div>
      </div>
      
      {/* Indicador de Data/Hora Ativa */}
      <div className="bg-primary/5 py-2 px-4 border-t border-border text-center">
        <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">
          {activeData.dayLabel} — {activeData.hour}
        </span>
      </div>
    </div>
  )
}
