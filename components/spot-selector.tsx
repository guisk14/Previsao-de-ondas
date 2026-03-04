"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, MapPin, Waves } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { beaches, getRatingLabel, type Beach } from "@/lib/wave-data"

interface SpotSelectorProps {
  selectedBeach: Beach
  onSelect: (beach: Beach) => void
}

export function SpotSelector({ selectedBeach, onSelect }: SpotSelectorProps) {
  const [open, setOpen] = useState(false)

  const beachesByRegion = useMemo(() => {
    const grouped: Record<string, Beach[]> = {}
    for (const beach of beaches) {
      if (!grouped[beach.region]) {
        grouped[beach.region] = []
      }
      grouped[beach.region].push(beach)
    }
    return grouped
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-[360px] justify-between h-12 bg-card border-border text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <div className="flex flex-col min-w-0">
              <span className="truncate font-medium text-sm text-foreground">
                {selectedBeach.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedBeach.region} &middot; {selectedBeach.currentWaveHeight}m &middot; {getRatingLabel(selectedBeach.rating)}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] sm:w-[360px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar praia ou regiao..." />
          <CommandList>
            <CommandEmpty>Nenhuma praia encontrada.</CommandEmpty>
            {Object.entries(beachesByRegion).map(([region, regionBeaches]) => (
              <CommandGroup key={region} heading={region}>
                {regionBeaches.map((beach) => (
                  <CommandItem
                    key={beach.id}
                    value={`${beach.name} ${beach.region}`}
                    onSelect={() => {
                      onSelect(beach)
                      setOpen(false)
                    }}
                    className="flex items-center justify-between gap-2 py-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Waves className="h-4 w-4 shrink-0 text-primary/60" />
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-sm font-medium">{beach.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {beach.currentWaveHeight}m &middot; {beach.currentPeriod}s &middot; {getRatingLabel(beach.rating)}
                        </span>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        selectedBeach.id === beach.id ? "opacity-100 text-primary" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
