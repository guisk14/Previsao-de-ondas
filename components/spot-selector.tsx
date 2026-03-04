"use client"

import { MapPin } from "lucide-react"
import { beaches, type Beach } from "@/lib/wave-data"

interface SpotSelectorProps {
  selectedBeach: Beach
  onSelect: (beach: Beach) => void
}

export function SpotSelector({ selectedBeach, onSelect }: SpotSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {beaches.map((beach) => (
        <button
          key={beach.id}
          onClick={() => onSelect(beach)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedBeach.id === beach.id
              ? "bg-primary text-primary-foreground"
              : "bg-card text-card-foreground border border-border hover:bg-secondary"
          }`}
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>{beach.name}</span>
          <span className="text-xs opacity-70">{beach.region}</span>
        </button>
      ))}
    </div>
  )
}
