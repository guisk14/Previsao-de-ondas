import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ForecastSection } from "@/components/forecast-section"
import { BeachCards } from "@/components/beach-cards"
import { TideSection } from "@/components/tide-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,_oklch(0.7_0.11_210_/_0.3),_transparent_65%)]" />
      <div className="pointer-events-none absolute -left-24 top-[32rem] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[56rem] h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <Header />
      <HeroSection />
      <ForecastSection />
      <BeachCards />
      <TideSection />
      <Footer />
    </main>
  )
}
