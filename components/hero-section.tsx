import Image from "next/image"
import { ArrowDown } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-end overflow-hidden">
      <Image
        src="/images/hero-ocean.jpg"
        alt="Onda do oceano ao por do sol"
        fill
        className="object-cover"
        priority
        quality={90}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-16 md:pb-24">
        <p className="text-primary-foreground/70 text-sm font-mono uppercase tracking-widest mb-3">
          Previsao das Ondas
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-primary-foreground leading-tight text-balance max-w-3xl">
          Saiba quando as melhores ondas vao chegar
        </h1>
        <p className="mt-4 text-primary-foreground/80 text-lg md:text-xl max-w-xl leading-relaxed">
          Dados atualizados de swell, vento e mare para as principais praias do litoral paulista.
        </p>
        <a
          href="#previsao"
          className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          Ver previsao
          <ArrowDown className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
