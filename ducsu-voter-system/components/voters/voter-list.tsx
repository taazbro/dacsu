'use client'

import { useState, useEffect } from 'react'
import { User, Building, BookOpen, Hash } from 'lucide-react'

interface VoterListProps {
  searchQuery: string
  selectedHalls: string[]
}

// Mock data - in production, this would come from API
const mockVoters = [
  { id: 'JS-001', name: 'Ahmed Rahman', hall: 'Kabi Jasimuddin Hall', department: 'Computer Science' },
  { id: 'KSKH-002', name: 'Fatima Begum', hall: 'Kabi Sufia Kamal Hall', department: 'Physics' },
  { id: 'JH-003', name: 'Karim Ali', hall: 'Jagannath Hall', department: 'Mathematics' },
  // Add more mock data as needed
]

export function VoterList({ searchQuery, selectedHalls }: VoterListProps) {
  const [voters, setVoters] = useState(mockVoters)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // In production, fetch from API based on searchQuery and selectedHalls
    const filtered = mockVoters.filter(voter => {
      const matchesSearch = !searchQuery || 
        voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voter.id.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesHall = selectedHalls.length === 0 || 
        selectedHalls.some(hallId => voter.hall.includes(hallId))
      
      return matchesSearch && matchesHall
    })
    
    setVoters(filtered)
  }, [searchQuery, selectedHalls])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vezran-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Voter Results
        </h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {voters.length} voters found
        </span>
      </div>

      {voters.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No voters found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Try adjusting your search or selecting different halls
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {voters.map(voter => (
            <div
              key={voter.id}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-vezran-primary/10 rounded-lg">
                  <User className="w-6 h-6 text-vezran-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {voter.name}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Hash className="w-3 h-3" />
                      <span>{voter.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Building className="w-3 h-3" />
                      <span>{voter.hall}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <BookOpen className="w-3 h-3" />
                      <span>{voter.department}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}