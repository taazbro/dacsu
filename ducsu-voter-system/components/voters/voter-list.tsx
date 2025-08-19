'use client'

import { useState, useEffect } from 'react'
import { User, CheckSquare, Square } from 'lucide-react'

interface VoterListProps {
  searchQuery: string
  selectedHalls: string[]
  language: 'bn' | 'en'
  batchMode: boolean
  selectedVoters: string[]
  onSelectionChange: (voters: string[]) => void
}

interface Voter {
  id: string
  name: string
  hall: string
  department?: string
  year?: string
}

export function VoterList({ 
  searchQuery, 
  selectedHalls, 
  language, 
  batchMode,
  selectedVoters,
  onSelectionChange 
}: VoterListProps) {
  const [voters, setVoters] = useState<Voter[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchVoters()
  }, [searchQuery, selectedHalls, page, language])

  const fetchVoters = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: page.toString(),
        lang: language,
        limit: '50'
      })
      
      if (selectedHalls.length > 0) {
        params.append('hall', selectedHalls[0])
      }

      const response = await fetch(`/api/voters?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setVoters(data.data.voters)
      }
    } catch (error) {
      console.error('Failed to fetch voters:', error)
    }
    setLoading(false)
  }

  const toggleVoterSelection = (voterId: string) => {
    if (selectedVoters.includes(voterId)) {
      onSelectionChange(selectedVoters.filter(id => id !== voterId))
    } else {
      onSelectionChange([...selectedVoters, voterId])
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="space-y-4">
        {voters.map(voter => (
          <div key={voter.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-4">
              {batchMode && (
                <button onClick={() => toggleVoterSelection(voter.id)}>
                  {selectedVoters.includes(voter.id) ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              )}
              <User className="w-10 h-10 text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{voter.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ID: {voter.id} | {voter.hall}
                  {voter.department && ` | ${voter.department}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {voters.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {language === 'bn' ? 'কোন ভোটার পাওয়া যায়নি' : 'No voters found'}
        </div>
      )}
    </div>
  )
}