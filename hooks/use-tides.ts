'use client'

import { useState, useEffect } from 'react'
import { type TideEntry } from '@/lib/wave-data'

export function useTides() {
  const [tides, setTides] = useState<TideEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTides() {
      try {
        const res = await fetch('/mares-santos-2026.json')
        const data = await res.json()
        
        // Pega o dia atual no formato YYYY-MM-DD
        const today = new Date()
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')
        const dateKey = `${year}-${month}-${day}`
        
        // Busca as mares do dia
        const tidesData = data.mares[dateKey] || []
        
        // Converte para o formato interno
        const tidesFormatted: TideEntry[] = tidesData.map((tide: any, index: number) => ({
          time: tide.hora,
          height: tide.altura,
          type: index % 2 === 0 ? 'alta' : 'baixa',
        }))
        
        setTides(tidesFormatted)
      } catch (error) {
        console.error('Erro ao buscar mares:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTides()
  }, [])

  return { tides, loading }
}
