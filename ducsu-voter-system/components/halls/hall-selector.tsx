'use client'

import { useState } from 'react'
import { Building, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const halls = [
  { id: 'KJH', name: 'Kabi Jasimuddin Hall', voters: 1299 },
  { id: 'KSKH', name: 'Kabi Sufia Kamal Hall', voters: 4434 },
  { id: 'JH', name: 'Jagannath Hall', voters: 2222 },
  { id: 'BBSMRH', name: 'Bangabandhu Sheikh Mujibur Rahman Hall', voters: 1609 },
  { id: 'DMSH', name: 'Dr Muhammad Shahidullah Hall', voters: 1998 },
  { id: 'FHMH', name: 'Fazlul Huq Muslim Hall', voters: 1762 },
  { id: 'BFMH', name: 'Begum Fazilatunnesa Mujib Hall', voters: 2641 },
  { id: 'BKMH', name: 'Bangladesh Kuwait Maitree Hall', voters: 2105 },
  { id: 'BEH', name: 'Bijoy Ekattor Hall', voters: 2040 },
  { id: 'SSZH', name: 'Shaheed Sergeant Zahurul Haq Hall', voters: 1960 },
  { id: 'SNH', name: 'Shamsun Nahar Hall', voters: 4090 },
  { id: 'SMH', name: 'Salimullah Muslim Hall', voters: 665 },
  { id: 'SSH', name: 'Surya Sen Hall', voters: 1501 },
  { id: 'SAFR', name: 'Sir AF Rahman Hall', voters: 1377 },
  { id: 'MZRH', name: 'Muktijoddha Ziaur Rahman Hall', voters: 1749 },
  { id: 'AEH', name: 'Amar Ekushey Hall', voters: 1291 },
  { id: 'HMMH', name: 'Haji Muhammad Muhsin Hall', voters: 1403 },
  { id: 'BRH', name: 'Begum Rokeya Hall', voters: 5643 },
]

interface HallSelectorProps {
  selectedHalls: string[]
  onSelectionChange: (halls: string[]) => void
}

export function HallSelector({ selectedHalls, onSelectionChange }: HallSelectorProps) {
  const toggleHall = (hallId: string) => {
    if (selectedHalls.includes(hallId)) {
      onSelectionChange(selectedHalls.filter(id => id !== hallId))
    } else {
      onSelectionChange([...selectedHalls, hallId])
    }
  }

  const selectAll = () => {
    onSelectionChange(halls.map(h => h.id))
  }

  const deselectAll = () => {
    onSelectionChange([])
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Select Halls
        </h2>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="px-4 py-2 text-sm bg-vezran-primary text-white rounded-lg hover:bg-vezran-primary/90"
          >
            Select All
          </button>
          <button
            onClick={deselectAll}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {halls.map(hall => (
          <div
            key={hall.id}
            onClick={() => toggleHall(hall.id)}
            className={cn(
              "p-4 rounded-lg border-2 cursor-pointer transition-all",
              selectedHalls.includes(hall.id)
                ? "border-vezran-primary bg-vezran-primary/10 dark:bg-vezran-primary/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {hall.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {hall.voters.toLocaleString()} voters
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {hall.id}
                  </span>
                </div>
              </div>
              {selectedHalls.includes(hall.id) && (
                <Check className="w-5 h-5 text-vezran-primary" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}