import { MapPin, Waves, Wind, Thermometer } from "lucide-react"
import { beaches, getRatingLabel, getRatingColor } from "@/lib/wave-data"

export function BeachCards() {
  return (
    <section id="praias" className="py-16 md:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-2">
          Praias
        </p>
        <h2 className="text-3xl md:text-4xl font-mono font-bold text-foreground text-balance mb-8">
          Condicoes Atuais por Praia
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beaches.map((beach) => (
            <div
              key={beach.id}
              className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-mono font-bold text-card-foreground group-hover:text-primary transition-colors">
                    {beach.name}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {beach.region}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getRatingColor(beach.rating)}`}>
                  {getRatingLabel(beach.rating)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1 bg-secondary/50 rounded-lg py-3">
                  <Waves className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Ondas</span>
                  <span className="text-sm font-mono font-bold text-card-foreground">
                    {beach.currentWaveHeight}m
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 bg-secondary/50 rounded-lg py-3">
                  <Wind className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Vento</span>
                  <span className="text-sm font-mono font-bold text-card-foreground">
                    {beach.currentWind}km/h
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 bg-secondary/50 rounded-lg py-3">
                  <Thermometer className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Agua</span>
                  <span className="text-sm font-mono font-bold text-card-foreground">
                    {beach.waterTemp}°C
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
