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
      {/* Header Compacto */}
      <div className="px-6 py-3 border-b border-border bg-muted/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Waves className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Condição das Ondas</h3>
        </div>
        <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest">
          Altura • Período • Vento
        </span>
      </div>

      {/* Gráfico Unificado com Cabeçalhos de Dia - Espaço Removido */}
      <div className="bg-background/50 pt-2 pb-4 px-2">
        <div className="h-72 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 25, right: 0, left: -20, bottom: 0 }}
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
                        <text x={x} y={-12} textAnchor="middle" fill="currentColor" className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                          {entry.dayLabel.split(" ")[0]} {entry.dayLabel.split(" ")[1].replace("(", "").replace(")", "")}
                        </text>
                      )}
                      {isHourLabel && (
                        <text x={x} y={y + 10} textAnchor="middle" fill="#94a3b8" fontSize={9} fontWeight="bold">
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
                  label={{ position: 'top', value: '', fill: 'rgba(0,0,0,0.1)', fontSize: 10 }}
                />
              ))}

              {/* Vento (Área Cinza ao Fundo) */}
              <Area
                type="monotone"
                dataKey="vento"
                stroke="none"
                fill="url(#colorVento)"
                yAxisId={0}
                animationDuration={500}
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
                animationDuration={500}
              />
              
              {/* Período (Linha Vermelha) */}
              <Line
                type="monotone"
                dataKey="periodo"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
                animationDuration={500}
              />
            </ComposedChart>
          </ResponsiveContainer>
          
          {/* Legenda Customizada Compacta */}
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Altura</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#94a3b8]" />
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Vento</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Período</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé Detalhado */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border bg-muted/5">
        <div className="p-3 border-r border-border flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
            <Waves className="h-3 w-3" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Altura</span>
          </div>
          <div className="text-lg font-mono font-bold text-foreground">
            {activeData.altura.toFixed(1)} <span className="text-[10px] font-normal text-muted-foreground">m</span>
          </div>
        </div>
        
        <div className="p-3 border-r border-border flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
            <Clock className="h-3 w-3" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Período</span>
          </div>
          <div className="text-lg font-mono font-bold text-foreground">
            {activeData.periodo.toFixed(1)} <span className="text-[10px] font-normal text-muted-foreground">s</span>
          </div>
        </div>

        <div className="p-3 border-r border-border flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
            <Navigation2 className="h-3 w-3" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Direção</span>
          </div>
          <div className="flex items-center gap-1 text-lg font-mono font-bold text-foreground">
            <span className="text-primary">{DIRECTION_ICONS[activeData.direcao]}</span>
            {activeData.direcao}
          </div>
        </div>

        <div className="p-3 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
            <Wind className="h-3 w-3" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Vento</span>
          </div>
          <div className="flex items-center gap-1 text-lg font-mono font-bold text-foreground">
            <span className="text-muted-foreground">{DIRECTION_ICONS[activeData.windDir]}</span>
            {activeData.vento} <span className="text-[9px] font-normal text-muted-foreground ml-1">{activeData.windDir}</span>
          </div>
        </div>
      </div>
      
      {/* Indicador de Data/Hora Ativa Compacto */}
      <div className="bg-primary/5 py-1.5 px-4 border-t border-border text-center">
        <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest">
          {activeData.dayLabel} — {activeData.hour}
        </span>
      </div>
    </div>
  )
}
