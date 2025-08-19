import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardStatsProps {
  title: string
  value: string
  icon: ReactNode
  trend?: string
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red'
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500'
}

const bgClasses = {
  blue: 'bg-blue-50 dark:bg-blue-900/20',
  green: 'bg-green-50 dark:bg-green-900/20',
  orange: 'bg-orange-50 dark:bg-orange-900/20',
  purple: 'bg-purple-50 dark:bg-purple-900/20',
  red: 'bg-red-50 dark:bg-red-900/20'
}

export function DashboardStats({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'blue' 
}: DashboardStatsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className={cn('p-3 rounded-lg', bgClasses[color])}>
          <div className={cn('text-white', colorClasses[color])}>
            {icon}
          </div>
        </div>
        {trend && (
          <span className={cn(
            'text-sm font-medium px-2 py-1 rounded-full',
            trend.startsWith('+') ? 'text-green-600 bg-green-100 dark:bg-green-900/20' : 
            trend.startsWith('-') ? 'text-red-600 bg-red-100 dark:bg-red-900/20' : 
            'text-gray-600 bg-gray-100 dark:bg-gray-700'
          )}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}