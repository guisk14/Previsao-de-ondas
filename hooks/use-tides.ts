'use client'

import { useState, useEffect } from 'react'
import { type TideEntry } from '@/lib/wave-data'

export interface TideData extends TideEntry {
  isNext: boolean
}

export function useTides() {
  const [tides, setTides] = useState<TideData[]>([])
  const [loading, setLoading] = useState(true)
  const [nextTide, setNextTide] = useState<TideData | null>(null)
  const [currentHour, setCurrentHour] = useState(12)

  useEffect(() => {
    async function fetchTides() {
      try {
        const res = await fetch('/mares-santos-2026.json')
        const data = await res.json()
        
        const dateKey = "2026-01-10"
        const tidesData = data.mares[dateKey] || []
        
        const today = new Date()
        const nowMinutes = today.getHours() * 60 + today.getMinutes()
        setCurrentHour(today.getHours())
        
        let foundNext = false
        const tidesFormatted: TideData[] = tidesData.map((tide: { hora: string; altura: number }, index: number) => {
          const [h, m] = tide.hora.split(':').map(Number)
          const tideMinutes = h * 60 + m
          const isNext = !foundNext && tideMinutes > nowMinutes
          if (isNext) foundNext = true
          
          return {
            time: tide.hora,
            height: tide.altura,
            type: index === 0 
              ? (tide.altura > (tidesData[1]?.altura || 0) ? 'alta' as const : 'baixa' as const)
              : (tide.altura > (tidesData[index - 1]?.altura || 0) ? 'alta' as const : 'baixa' as const),
            isNext,
          }
        })
        
        setTides(tidesFormatted)
        setNextTide(tidesFormatted.find(t => t.isNext) || null)
      } catch (error) {
        console.error('Erro ao buscar mares:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTides()
  }, [])

  return { tides, loading, nextTide, currentHour }
}
