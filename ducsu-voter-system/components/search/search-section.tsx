'use client'

import { useState } from 'react'
import { Search, Filter, Download } from 'lucide-react'
import { debounce } from '@/lib/utils'

interface SearchSectionProps {
  onSearch: (query: string) => void
  selectedHalls: string[]
}

export function SearchSection({ onSearch, selectedHalls }: SearchSectionProps) {
  const [query, setQuery] = useState('')

  const handleSearch = debounce((value: string) => {
    onSearch(value)
  }, 300)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Search Voters
      </h2>
      
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, ID, hall, or department..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-vezran-primary focus:border-transparent outline-none"
            onChange={(e) => {
              setQuery(e.target.value)
              handleSearch(e.target.value)
            }}
            value={query}
          />
        </div>
        
        <button className="px-6 py-3 bg-vezran-primary text-white rounded-lg hover:bg-vezran-primary/90 
                         transition-colors flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter
        </button>
        
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
                         transition-colors flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>
      
      {selectedHalls.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Selected Halls: {selectedHalls.length}
          </span>
        </div>
      )}
    </div>
  )
}