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
  rating: number
  forecast: ForecastHour[]
}

export interface TideEntry {
  time: string
  height: number
  type: "alta" | "baixa"
}

const DAYS = [
  { label: "Seg (10)", index: 0 },
  { label: "Ter (11)", index: 1 },
  { label: "Qua (12)", index: 2 },
  { label: "Qui (13)", index: 3 },
  { label: "Sex (14)", index: 4 },
]

const HOURS = ["00h", "03h", "06h", "09h", "12h", "15h", "18h", "21h"]
const DIRS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"]

function buildForecast(
  heights: number[],
  periods: number[],
  waveDirs: number[],
  windSpeeds: number[],
  windDirs: number[],
  temps: number[],
): ForecastHour[] {
  const entries: ForecastHour[] = []
  let i = 0
  for (const day of DAYS) {
    for (const hour of HOURS) {
      entries.push({
        hour,
        dayLabel: day.label,
        dayIndex: day.index,
        waveHeight: heights[i],
        wavePeriod: periods[i],
        waveDirection: DIRS[waveDirs[i]],
        windSpeed: windSpeeds[i],
        windDirection: DIRS[windDirs[i]],
        temperature: temps[i],
      })
      i++
    }
  }
  return entries
}

const supertubosData = buildForecast(
  [1.8,1.6,1.4,1.2,1.5,1.9,2.1,1.8, 1.7,1.5,1.3,1.6,2.0,2.3,2.1,1.9, 1.8,1.6,1.9,2.2,2.5,2.4,2.0,1.7, 1.5,1.3,1.1,1.4,1.8,2.0,1.9,1.6, 1.4,1.2,1.0,1.3,1.7,1.9,1.8,1.5],
  [12,11,10,10,11,12,13,12, 11,10,10,11,12,13,13,12, 12,11,12,13,14,14,13,12, 11,10,9,10,11,12,12,11, 10,9,9,10,11,12,11,10],
  [0,0,1,1,0,7,7,0, 1,1,0,0,7,7,0,0, 0,1,1,0,7,7,0,0, 0,0,1,1,0,7,7,0, 1,1,0,0,7,7,0,0],
  [15,12,10,8,10,14,16,18, 14,11,9,7,11,15,17,16, 13,10,8,9,12,16,18,15, 16,13,11,9,10,14,17,19, 18,15,12,10,11,13,16,18],
  [0,0,1,1,0,7,7,0, 0,1,1,0,7,7,0,0, 0,0,1,1,0,7,7,0, 0,0,1,1,0,7,7,0, 0,1,1,0,7,7,0,0],
  [16,15,15,16,17,17,16,15, 16,15,15,16,17,17,16,15, 16,16,16,17,17,17,16,16, 15,15,15,16,16,16,15,15, 15,15,15,16,16,16,15,15],
)

const ribeiraData = buildForecast(
  [1.5,1.3,1.1,1.0,1.2,1.6,1.8,1.5, 1.4,1.2,1.0,1.3,1.7,2.0,1.8,1.6, 1.5,1.3,1.6,1.9,2.2,2.1,1.7,1.4, 1.2,1.0,0.9,1.1,1.5,1.7,1.6,1.3, 1.1,0.9,0.8,1.0,1.4,1.6,1.5,1.2],
  [10,9,9,10,11,12,11,10, 10,9,9,10,11,12,12,11, 11,10,11,12,13,13,12,11, 10,9,8,9,10,11,11,10, 9,8,8,9,10,11,10,9],
  [1,1,2,2,1,0,0,1, 1,2,2,1,0,0,1,1, 1,1,2,1,0,0,1,1, 1,1,2,2,1,0,0,1, 1,2,2,1,0,0,1,1],
  [12,10,8,6,9,13,15,14, 11,9,7,5,10,14,16,13, 10,8,6,7,11,15,17,12, 13,11,9,7,8,12,15,16, 15,12,10,8,9,11,14,16],
  [1,1,0,0,1,7,7,1, 1,0,0,1,7,7,1,1, 1,1,0,0,7,7,1,1, 1,1,0,0,1,7,7,1, 1,0,0,1,7,7,1,1],
  [17,16,16,17,18,18,17,16, 17,16,16,17,18,18,17,16, 17,17,17,18,18,18,17,17, 16,16,16,17,17,17,16,16, 16,16,16,17,17,17,16,16],
)

const nazareData = buildForecast(
  [3.2,2.8,2.5,2.3,2.7,3.5,3.8,3.3, 3.0,2.6,2.3,2.8,3.4,3.9,3.6,3.1, 2.9,2.5,3.0,3.5,4.0,3.7,3.2,2.8, 2.5,2.2,1.9,2.4,3.0,3.4,3.1,2.7, 2.3,2.0,1.8,2.2,2.8,3.2,2.9,2.5],
  [15,14,13,13,14,15,16,15, 14,13,13,14,15,16,16,15, 15,14,15,16,17,17,16,15, 14,13,12,13,14,15,15,14, 13,12,12,13,14,15,14,13],
  [7,7,0,0,7,6,6,7, 7,0,0,7,6,6,7,7, 7,7,0,7,6,6,7,7, 7,7,0,0,7,6,6,7, 7,0,0,7,6,6,7,7],
  [20,17,14,12,15,19,22,24, 18,15,12,10,16,20,23,21, 17,14,11,13,17,21,24,19, 21,18,15,12,14,18,22,25, 23,20,16,13,15,18,21,24],
  [7,7,0,0,7,6,6,7, 7,0,0,7,6,6,7,7, 7,7,0,0,6,6,7,7, 7,7,0,0,7,6,6,7, 7,0,0,7,6,6,7,7],
  [15,14,14,15,16,16,15,14, 15,14,14,15,16,16,15,14, 15,15,15,16,16,16,15,15, 14,14,14,15,15,15,14,14, 14,14,14,15,15,15,14,14],
)

const tonelData = buildForecast(
  [1.2,1.0,0.9,0.8,1.0,1.3,1.5,1.2, 1.1,0.9,0.8,1.0,1.4,1.6,1.4,1.2, 1.1,1.0,1.2,1.5,1.8,1.6,1.3,1.1, 1.0,0.8,0.7,0.9,1.2,1.4,1.3,1.0, 0.9,0.7,0.6,0.8,1.1,1.3,1.2,0.9],
  [9,8,8,9,10,11,10,9, 9,8,8,9,10,11,11,10, 10,9,10,11,12,12,11,10, 9,8,7,8,9,10,10,9, 8,7,7,8,9,10,9,8],
  [6,6,5,5,6,7,7,6, 6,5,5,6,7,7,6,6, 6,6,5,6,7,7,6,6, 6,6,5,5,6,7,7,6, 6,5,5,6,7,7,6,6],
  [18,15,12,10,13,17,20,22, 16,13,10,8,14,18,21,19, 15,12,9,11,15,19,22,17, 19,16,13,10,12,16,20,23, 21,18,14,11,13,16,19,22],
  [6,6,5,5,6,7,7,6, 6,5,5,6,7,7,6,6, 6,6,5,5,7,7,6,6, 6,6,5,5,6,7,7,6, 6,5,5,6,7,7,6,6],
  [18,17,17,18,19,19,18,17, 18,17,17,18,19,19,18,17, 18,18,18,19,19,19,18,18, 17,17,17,18,18,18,17,17, 17,17,17,18,18,18,17,17],
)

const caparicaData = buildForecast(
  [1.0,0.8,0.7,0.6,0.8,1.1,1.3,1.0, 0.9,0.7,0.6,0.8,1.2,1.4,1.2,1.0, 0.9,0.8,1.0,1.3,1.6,1.4,1.1,0.9, 0.8,0.6,0.5,0.7,1.0,1.2,1.1,0.8, 0.7,0.5,0.4,0.6,0.9,1.1,1.0,0.7],
  [8,7,7,8,9,10,9,8, 8,7,7,8,9,10,10,9, 9,8,9,10,11,11,10,9, 8,7,6,7,8,9,9,8, 7,6,6,7,8,9,8,7],
  [7,7,0,0,7,6,6,7, 7,0,0,7,6,6,7,7, 7,7,0,7,6,6,7,7, 7,7,0,0,7,6,6,7, 7,0,0,7,6,6,7,7],
  [10,8,6,5,7,11,13,12, 9,7,5,4,8,12,14,11, 8,6,5,6,9,13,15,10, 11,9,7,5,7,10,13,15, 13,10,8,6,8,10,12,14],
  [7,7,0,0,7,6,6,7, 7,0,0,7,6,6,7,7, 7,7,0,0,6,6,7,7, 7,7,0,0,7,6,6,7, 7,0,0,7,6,6,7,7],
  [17,16,16,17,18,18,17,16, 17,16,16,17,18,18,17,16, 17,17,17,18,18,18,17,17, 16,16,16,17,17,17,16,16, 16,16,16,17,17,17,16,16],
)

const espinhoData = buildForecast(
  [1.6,1.4,1.2,1.1,1.3,1.7,1.9,1.6, 1.5,1.3,1.1,1.4,1.8,2.1,1.9,1.7, 1.6,1.4,1.7,2.0,2.3,2.2,1.8,1.5, 1.3,1.1,1.0,1.2,1.6,1.8,1.7,1.4, 1.2,1.0,0.9,1.1,1.5,1.7,1.6,1.3],
  [11,10,10,11,12,13,12,11, 11,10,10,11,12,13,13,12, 12,11,12,13,14,14,13,12, 11,10,9,10,11,12,12,11, 10,9,9,10,11,12,11,10],
  [0,0,1,1,0,7,7,0, 0,1,1,0,7,7,0,0, 0,0,1,0,7,7,0,0, 0,0,1,1,0,7,7,0, 0,1,1,0,7,7,0,0],
  [14,11,9,7,10,14,17,16, 13,10,8,6,11,15,18,14, 12,9,7,8,12,16,19,13, 15,12,10,8,9,13,16,18, 17,14,11,9,10,12,15,17],
  [0,0,1,1,0,7,7,0, 0,1,1,0,7,7,0,0, 0,0,1,1,7,7,0,0, 0,0,1,1,0,7,7,0, 0,1,1,0,7,7,0,0],
  [15,14,14,15,16,16,15,14, 15,14,14,15,16,16,15,14, 15,15,15,16,16,16,15,15, 14,14,14,15,15,15,14,14, 14,14,14,15,15,15,14,14],
)

export const beaches: Beach[] = [
  {
    id: "guaruja-enseada",
    name: "Enseada",
    region: "Guaruja",
    currentWaveHeight: 1.2,
    currentPeriod: 10,
    currentWind: 12,
    windDirection: "SE",
    waterTemp: 24,
    rating: 4,
    forecast: supertubosData,
  },
  {
    id: "guaruja-tombo",
    name: "Tombo",
    region: "Guaruja",
    currentWaveHeight: 1.8,
    currentPeriod: 12,
    currentWind: 15,
    windDirection: "E",
    waterTemp: 25,
    rating: 5,
    forecast: ribeiraData,
  },
  {
    id: "guaruja-pitangueiras",
    name: "Pitangueiras",
    region: "Guaruja",
    currentWaveHeight: 1.4,
    currentPeriod: 11,
    currentWind: 14,
    windDirection: "SE",
    waterTemp: 24,
    rating: 4,
    forecast: nazareData,
  },
  {
    id: "guaruja-pernambuco",
    name: "Pernambuco",
    region: "Guaruja",
    currentWaveHeight: 1.0,
    currentPeriod: 9,
    currentWind: 10,
    windDirection: "E",
    waterTemp: 25,
    rating: 3,
    forecast: tonelData,
  },
  {
    id: "bertioga-praia-brava",
    name: "Praia Brava",
    region: "Bertioga",
    currentWaveHeight: 2.2,
    currentPeriod: 14,
    currentWind: 18,
    windDirection: "SE",
    waterTemp: 24,
    rating: 4,
    forecast: caparicaData,
  },
  {
    id: "bertioga-guaratuba",
    name: "Guaratuba",
    region: "Bertioga",
    currentWaveHeight: 1.6,
    currentPeriod: 11,
    currentWind: 14,
    windDirection: "E",
    waterTemp: 25,
    rating: 4,
    forecast: espinhoData,
  },
]

export const tides: TideEntry[] = [
  { time: "01:20", height: 0.9, type: "alta" },
  { time: "07:45", height: 0.2, type: "baixa" },
  { time: "13:30", height: 1.0, type: "alta" },
  { time: "19:50", height: 0.3, type: "baixa" },
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
