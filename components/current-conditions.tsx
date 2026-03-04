import { Waves, Wind, Thermometer, Timer, Compass, Star } from "lucide-react"
import { type Beach, getRatingLabel, getRatingColor } from "@/lib/wave-data"

interface CurrentConditionsProps {
  beach: Beach
}

export function CurrentConditions({ beach }: CurrentConditionsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <ConditionCard
        icon={<Waves className="h-5 w-5 text-primary" />}
        label="Altura"
        value={`${beach.currentWaveHeight}m`}
      />
      <ConditionCard
        icon={<Timer className="h-5 w-5 text-primary" />}
        label="Periodo"
        value={`${beach.currentPeriod}s`}
      />
      <ConditionCard
        icon={<Wind className="h-5 w-5 text-primary" />}
        label="Vento"
        value={`${beach.currentWind} km/h`}
      />
      <ConditionCard
        icon={<Compass className="h-5 w-5 text-primary" />}
        label="Direcao Vento"
        value={beach.windDirection}
      />
      <ConditionCard
        icon={<Thermometer className="h-5 w-5 text-primary" />}
        label="Temperatura Agua"
        value={`${beach.waterTemp}°C`}
      />
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col items-center justify-center gap-2">
        <Star className="h-5 w-5 text-chart-4" />
        <span className="text-xs text-muted-foreground">Condicoes</span>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getRatingColor(beach.rating)}`}>
          {getRatingLabel(beach.rating)}
        </span>
      </div>
    </div>
  )
}

function ConditionCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex flex-col items-center justify-center gap-2 text-center">
      {icon}
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-mono font-bold text-card-foreground">{value}</span>
    </div>
  )
}
