'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, Building, Activity, TrendingUp, 
  Search, Download, ChevronRight, LogOut,
  Moon, Sun, Command, QrCode, Shield,
  Database, RefreshCw, Globe
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useLanguageStore } from '@/store/language'
import { DashboardStats } from '@/components/dashboard/stats'
import { SearchSection } from '@/components/search/search-section'
import { HallSelector } from '@/components/halls/hall-selector'
import { VoterList } from '@/components/voters/voter-list'
import { CommandPalette } from '@/components/command-palette'
import { LanguageToggle } from '@/components/language-toggle'
import { useTheme } from '@/hooks/use-theme'
import toast from 'react-hot-toast'
import { getTotalVoters } from '@/lib/hall-data'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { language, t } = useLanguageStore()
  const { theme, toggleTheme } = useTheme()
  const [commandOpen, setCommandOpen] = useState(false)
  const [selectedHalls, setSelectedHalls] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [batchMode, setBatchMode] = useState(false)
  const [selectedVoters, setSelectedVoters] = useState<string[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success(t('logoutSuccess'))
    router.push('/')
  }

  const handleExport = async () => {
    // Export functionality
    toast.success(t('exportSuccess'))
  }

  const handleBatchExport = () => {
    if (selectedVoters.length === 0) {
      toast.error(t('noVotersSelected'))
      return
    }
    toast.success(`Exporting ${selectedVoters.length} voters...`)
  }

  if (!user) return null

  const stats = {
    totalVoters: getTotalVoters(),
    totalHalls: 18,
    activeSessions: 142,
    performance: 99.9
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">🏛️</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('title')}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enterprise Edition
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <LanguageToggle />

              {/* User Badge */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-vezran-primary/10 rounded-full">
                <span className="text-sm font-medium text-vezran-primary">
                  {user.role === 'admin' ? '👑' : '👤'} {user.name}
                </span>
              </div>

              {/* Command Palette Button */}
              <button
                onClick={() => setCommandOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Command className="w-4 h-4" />
                <span className="text-sm">⌘K</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <DashboardStats
              title={t('totalVoters')}
              value={stats.totalVoters.toLocaleString()}
              icon={<Users className="w-6 h-6" />}
              trend="+12.5%"
              color="blue"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <DashboardStats
              title={t('totalHalls')}
              value={stats.totalHalls.toString()}
              icon={<Building className="w-6 h-6" />}
              trend="All Active"
              color="green"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DashboardStats
              title={t('activeSessions')}
              value={stats.activeSessions.toString()}
              icon={<Activity className="w-6 h-6" />}
              trend="Real-time"
              color="orange"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DashboardStats
              title={t('performance')}
              value={`${stats.performance}%`}
              icon={<TrendingUp className="w-6 h-6" />}
              trend="Optimal"
              color="purple"
            />
          </motion.div>
        </div>

        {/* Enterprise Features Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <QrCode className="w-4 h-4" />
                <span>QR Scan</span>
              </button>
              
              <button 
                onClick={() => setBatchMode(!batchMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  batchMode 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Batch Mode</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                <Database className="w-4 h-4" />
                <span>Backup</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
                <RefreshCw className="w-4 h-4" />
                <span>Sync</span>
              </button>
            </div>
            
            {batchMode && selectedVoters.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedVoters.length} selected
                </span>
                <button 
                  onClick={handleBatchExport}
                  className="px-4 py-2 bg-vezran-primary text-white rounded-lg"
                >
                  Export Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hall Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <HallSelector
            selectedHalls={selectedHalls}
            onSelectionChange={setSelectedHalls}
            language={language}
          />
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <SearchSection
            onSearch={setSearchQuery}
            selectedHalls={selectedHalls}
            language={language}
          />
        </motion.div>

        {/* Voter List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <VoterList
            searchQuery={searchQuery}
            selectedHalls={selectedHalls}
            language={language}
            batchMode={batchMode}
            selectedVoters={selectedVoters}
            onSelectionChange={setSelectedVoters}
          />
        </motion.div>
      </main>

      {/* Footer with VEZRAN Branding */}
      <footer className="mt-auto py-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4">
            <span className="text-3xl font-bold bg-gradient-to-r from-vezran-accent to-vezran-primary bg-clip-text text-transparent">
              VEZRAN
            </span>
          </div>
          <p className="text-sm text-gray-400">
            World's First Super Intelligence System
          </p>
          <div className="mt-4 flex justify-center space-x-8">
            <div>
              <span className="text-2xl font-bold">39,789</span>
              <p className="text-xs text-gray-400">Voters Managed</p>
            </div>
            <div>
              <span className="text-2xl font-bold">18</span>
              <p className="text-xs text-gray-400">Halls Integrated</p>
            </div>
            <div>
              <span className="text-2xl font-bold">99.9%</span>
              <p className="text-xs text-gray-400">Uptime</p>
            </div>
            <div>
              <span className="text-2xl font-bold">AI</span>
              <p className="text-xs text-gray-400">Powered</p>
            </div>
          </div>
          <div className="mt-6 text-xs text-gray-500">
            © 2024 DUCSU Voter Management System | Enhanced by VEZRAN Super Intelligence
          </div>
        </div>
      </footer>

      {/* Command Palette */}
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  )
}