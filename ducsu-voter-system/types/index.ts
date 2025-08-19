export interface Voter {
  id: string
  name: string
  hall: string
  department?: string
  prefix: string
  serial: string
  session?: string
  registrationSession?: string
  lineNumber?: number
}

export interface Hall {
  id: string
  name: string
  nameBn: string
  prefix: string
  voterCount: number
  voters?: Voter[]
}

export interface User {
  id: string
  username: string
  name: string
  role: 'admin' | 'viewer' | 'moderator'
  permissions: string[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

export interface SearchFilters {
  query: string
  hall?: string
  department?: string
  session?: string
  page: number
  limit: number
}

export interface DashboardStats {
  totalVoters: number
  totalHalls: number
  activeSessions: number
  performance: number
  recentActivity: Activity[]
}

export interface Activity {
  id: string
  action: string
  user: string
  timestamp: Date
  details?: any
}

export interface AuditLog {
  id: string
  action: string
  user: string
  role: string
  timestamp: Date
  sessionId: string
  details: any
}

export type Language = 'bn' | 'en'

export interface Translation {
  [key: string]: string
}

export interface AppState {
  language: Language
  darkMode: boolean
  sidebarOpen: boolean
  commandPaletteOpen: boolean
}

export interface ExportOptions {
  format: 'excel' | 'csv' | 'json' | 'pdf'
  fields?: string[]
  filters?: SearchFilters
}

export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface Prediction {
  type: string
  value: number | string
  confidence: number
  trend: 'up' | 'down' | 'stable'
}

export interface BackupData {
  id: string
  timestamp: Date
  type: 'manual' | 'auto'
  size: string
  voterCount: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface BatchOperation {
  action: 'export' | 'delete' | 'update'
  voterIds: string[]
  options?: any
}

export interface NotificationOptions {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}