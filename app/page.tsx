import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ForecastSection } from "@/components/forecast-section"
import { BeachCards } from "@/components/beach-cards"
import { TideSection } from "@/components/tide-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ForecastSection />
      <BeachCards />
      <TideSection />
      <Footer />
    </main>
  )
}
