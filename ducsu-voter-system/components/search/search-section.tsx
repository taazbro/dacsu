'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface SearchSectionProps {
  onSearch: (query: string) => void
  selectedHalls: string[]
  language: 'bn' | 'en'
}

export function SearchSection({ onSearch, selectedHalls, language }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'নাম, আইডি বা বিভাগ দিয়ে খুঁজুন...' : 'Search by name, ID or department...'}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {language === 'bn' ? 'খুঁজুন' : 'Search'}
        </button>
      </form>
    </div>
  )
}