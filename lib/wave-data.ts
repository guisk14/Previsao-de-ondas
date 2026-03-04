export interface ForecastHour {
  hour: string
  dayLabel: string
  dayIndex: number
  waveHeight: number
  wavePeriod: number
  waveDirection: string
  windSpeed: number
  windDirection: string
  temperature: number
}

export interface Beach {
  id: string
  name: string
  region: string
  currentWaveHeight: number
  currentPeriod: number
  currentWind: number
  windDirection: string
  waterTemp: number
  rating: number // 1-5
  forecast: ForecastHour[]
}

export interface TideEntry {
  time: string
  height: number
  type: "alta" | "baixa"
}

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

const generateForecast = (): ForecastHour[] => {
  const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"]
  const hours = [0, 3, 6, 9, 12, 15, 18, 21]
  const entries: ForecastHour[] = []
  const today = new Date()

  for (let d = 0; d < 5; d++) {
    const date = new Date(today)
    date.setDate(today.getDate() + d)
    const dayName = DAY_NAMES[date.getDay()]
    const dayNum = date.getDate()
    const dayLabel = `${dayName} (${dayNum})`

    for (const h of hours) {
      const baseHeight = 0.6 + Math.sin((d * 6 + h) * 0.18) * 0.6 + Math.random() * 0.4
      entries.push({
        hour: `${String(h).padStart(2, "0")}h`,
        dayLabel,
        dayIndex: d,
        waveHeight: +Math.max(0.2, baseHeight).toFixed(1),
        wavePeriod: +(Math.random() * 8 + 6).toFixed(1),
        waveDirection: directions[Math.floor(Math.random() * directions.length)],
        windSpeed: Math.floor(Math.random() * 20 + 5),
        windDirection: directions[Math.floor(Math.random() * directions.length)],
        temperature: Math.floor(Math.random() * 6 + 14),
      })
    }
  }
  return entries
}

export const beaches: Beach[] = [
  {
    id: "peniche-supertubos",
    name: "Supertubos",
    region: "Peniche",
    currentWaveHeight: 1.8,
    currentPeriod: 12,
    currentWind: 15,
    windDirection: "N",
    waterTemp: 16,
    rating: 5,
    forecast: generateForecast(),
  },
  {
    id: "ericeira-ribeira-dilhas",
    name: "Ribeira d'Ilhas",
    region: "Ericeira",
    currentWaveHeight: 1.5,
    currentPeriod: 10,
    currentWind: 12,
    windDirection: "NE",
    waterTemp: 17,
    rating: 4,
    forecast: generateForecast(),
  },
  {
    id: "nazare-praia-norte",
    name: "Praia do Norte",
    region: "Nazare",
    currentWaveHeight: 3.2,
    currentPeriod: 15,
    currentWind: 20,
    windDirection: "NO",
    waterTemp: 15,
    rating: 3,
    forecast: generateForecast(),
  },
  {
    id: "sagres-tonel",
    name: "Praia do Tonel",
    region: "Sagres",
    currentWaveHeight: 1.2,
    currentPeriod: 9,
    currentWind: 18,
    windDirection: "O",
    waterTemp: 18,
    rating: 4,
    forecast: generateForecast(),
  },
  {
    id: "costa-caparica",
    name: "Costa da Caparica",
    region: "Setubal",
    currentWaveHeight: 1.0,
    currentPeriod: 8,
    currentWind: 10,
    windDirection: "NO",
    waterTemp: 17,
    rating: 3,
    forecast: generateForecast(),
  },
  {
    id: "espinho-praia",
    name: "Praia de Espinho",
    region: "Porto",
    currentWaveHeight: 1.6,
    currentPeriod: 11,
    currentWind: 14,
    windDirection: "N",
    waterTemp: 15,
    rating: 4,
    forecast: generateForecast(),
  },
]

export const tides: TideEntry[] = [
  { time: "02:15", height: 3.4, type: "alta" },
  { time: "08:30", height: 0.6, type: "baixa" },
  { time: "14:45", height: 3.2, type: "alta" },
  { time: "20:55", height: 0.8, type: "baixa" },
]

export function getRatingLabel(rating: number): string {
  if (rating >= 5) return "Epico"
  if (rating >= 4) return "Bom"
  if (rating >= 3) return "Medio"
  if (rating >= 2) return "Fraco"
  return "Flat"
}

export function getRatingColor(rating: number): string {
  if (rating >= 5) return "bg-chart-4 text-foreground"
  if (rating >= 4) return "bg-chart-2 text-accent-foreground"
  if (rating >= 3) return "bg-chart-3 text-accent-foreground"
  if (rating >= 2) return "bg-chart-5 text-accent-foreground"
  return "bg-muted text-muted-foreground"
}
