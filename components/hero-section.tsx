import Image from "next/image"
import { ArrowDown, Gauge, Wind, Waves } from "lucide-react"
import type { ReactNode } from "react"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[620px] items-end overflow-hidden pt-24 md:h-[90vh] md:min-h-[700px]">
      <Image
        src="/images/hero-ocean.jpg"
        alt="Onda do oceano ao por do sol"
        fill
        className="object-cover"
        priority
        quality={90}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/45 to-foreground/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,oklch(0.8_0.11_210_/_0.3),transparent_40%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 pb-14 md:grid-cols-[1.2fr_0.8fr] md:items-end md:pb-20">
        <div>
          <p className="mb-3 text-sm font-mono uppercase tracking-[0.2em] text-primary-foreground/80">
            Previsao das Ondas
          </p>
          <h1 className="max-w-3xl text-balance text-4xl font-mono font-bold leading-tight text-primary-foreground md:text-6xl lg:text-7xl">
            Saiba quando as melhores ondas vao chegar
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/85 md:text-xl">
            Dados atualizados de swell, vento e mare para as principais praias do litoral paulista.
          </p>
          <a
            href="#previsao"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Ver previsao
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-3 backdrop-blur-md">
          <Metric icon={<Waves className="h-4 w-4 text-cyan-300" />} label="Swell" value="1.2 - 2.0m" />
          <Metric icon={<Wind className="h-4 w-4 text-blue-200" />} label="Vento" value="8 - 18km/h" />
          <Metric icon={<Gauge className="h-4 w-4 text-emerald-300" />} label="Periodo" value="11s" />
        </div>
      </div>
    </section>
  )
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-primary-foreground/15 bg-foreground/15 px-3 py-4 text-center">
      <div className="mb-2 flex justify-center">{icon}</div>
      <p className="text-[11px] uppercase tracking-wide text-primary-foreground/70">{label}</p>
      <p className="mt-1 text-sm font-mono font-bold text-primary-foreground">{value}</p>
    </div>
  )
}
