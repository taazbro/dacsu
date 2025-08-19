'use client'

import { hallsDataBn, hallsDataEn } from '@/lib/hall-data'

interface HallSelectorProps {
  selectedHalls: string[]
  onSelectionChange: (halls: string[]) => void
  language: 'bn' | 'en'
}

export function HallSelector({ selectedHalls, onSelectionChange, language }: HallSelectorProps) {
  const halls = language === 'bn' ? hallsDataBn : hallsDataEn

  const toggleHall = (hallName: string) => {
    if (selectedHalls.includes(hallName)) {
      onSelectionChange(selectedHalls.filter(h => h !== hallName))
    } else {
      onSelectionChange([...selectedHalls, hallName])
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {language === 'bn' ? 'হল নির্বাচন করুন' : 'Select Halls'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {halls.map(hall => (
          <button
            key={hall.id}
            onClick={() => toggleHall(hall.name)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              selectedHalls.includes(hall.name)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
            }`}
          >
            <div className="text-sm font-medium">{hall.name}</div>
            <div className="text-xs opacity-75">{hall.voters.toLocaleString()} voters</div>
          </button>
        ))}
      </div>
    </div>
  )
}