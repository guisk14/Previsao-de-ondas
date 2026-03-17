"use client"

import { useState } from "react"
import { beaches } from "@/lib/wave-data"
import { SpotSelector } from "./spot-selector"
import { CurrentConditions } from "./current-conditions"
import { ForecastTable } from "./forecast-table"
import { WaveConditionChart } from "./wave-condition-chart"
import { WindDirectionTable } from "./wind-direction-table"

export function ForecastSection() {
  const [selectedBeach, setSelectedBeach] = useState(beaches[0])

  return (
    <section id="previsao" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-2">
          Previsao Detalhada
        </p>
        <h2 className="text-3xl md:text-4xl font-mono font-bold text-foreground text-balance mb-8">
          Escolha o seu spot
        </h2>

        <div className="flex flex-col gap-6">
          <SpotSelector selectedBeach={selectedBeach} onSelect={setSelectedBeach} />
          <CurrentConditions beach={selectedBeach} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Coluna da Esquerda: Gráfico de Ondas */}
            <div className="flex flex-col gap-6">
              <WaveConditionChart beach={selectedBeach} />
            </div>

            {/* Coluna da Direita: Tabelas Empilhadas */}
            <div className="flex flex-col gap-6">
              <ForecastTable beach={selectedBeach} />
              <WindDirectionTable beach={selectedBeach} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
