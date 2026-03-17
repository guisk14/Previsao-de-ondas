import { MapPin, Waves, Wind, Thermometer } from "lucide-react"
import { beaches, getRatingLabel, getRatingColor } from "@/lib/wave-data"

export function BeachCards() {
  return (
    <section id="praias" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <p className="mb-2 text-sm font-mono uppercase tracking-widest text-muted-foreground">Praias</p>
        <h2 className="mb-8 text-balance text-3xl font-mono font-bold text-foreground md:text-4xl">
          Condicoes Atuais por Praia
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {beaches.map((beach) => (
            <div
              key={beach.id}
              className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />

              <div className="relative mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-mono font-bold text-card-foreground transition-colors group-hover:text-primary">
                    {beach.name}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {beach.region}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${getRatingColor(beach.rating)}`}>
                  {getRatingLabel(beach.rating)}
                </span>
              </div>

              <div className="relative grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-secondary/40 py-3">
                  <Waves className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Ondas</span>
                  <span className="text-sm font-mono font-bold text-card-foreground">{beach.currentWaveHeight}m</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-secondary/40 py-3">
                  <Wind className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Vento</span>
                  <span className="text-sm font-mono font-bold text-card-foreground">{beach.currentWind}km/h</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-secondary/40 py-3">
                  <Thermometer className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Agua</span>
                  <span className="text-sm font-mono font-bold text-card-foreground">{beach.waterTemp}°C</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
