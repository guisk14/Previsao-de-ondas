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
  AreaChart,
  Area,
  LineChart,
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
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

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

  const chartData = useMemo(() => {
    return beach.forecast
      .filter(entry => entry.dayIndex === selectedDayIndex)
      .map((entry, i) => ({
        index: i,
        hour: entry.hour,
        altura: entry.waveHeight,
        periodo: entry.wavePeriod,
        vento: entry.windSpeed,
        direcao: entry.waveDirection,
        windDir: entry.windDirection,
      }))
  }, [beach.forecast, selectedDayIndex])

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
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-muted/10">
        <div className="flex items-center gap-2 mb-1">
          <Waves className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Condição das Ondas</h3>
        </div>
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-4">
          Altura • Período • Vento
        </p>

        {/* Seletores de Dia (Estilo Abas) */}
        <div className="flex border-b border-border">
          {days.map((day) => {
            const isSelected = selectedDayIndex === day.index
            return (
              <button
                key={day.index}
                onClick={() => setSelectedDayIndex(day.index)}
                className={cn(
                  "px-6 py-2 text-sm font-bold transition-all relative",
                  isSelected 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {day.label.split(" ")[0]} {day.label.split(" ")[1].replace("(", "").replace(")", "")}
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Gráfico */}
      <div className="p-6 bg-background/50">
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
              <XAxis 
                dataKey="hour" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <YAxis hide domain={[0, 'dataMax + 2']} />
              <Tooltip cursor={{ stroke: '#ef4444', strokeWidth: 1 }} content={<></>} />
              
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
          <div className="flex justify-center gap-6 mt-2">
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
    </div>
  )
}
