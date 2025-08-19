import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'bn' | 'en'

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  bn: {
    // Main UI
    title: 'ডাকসু ভোটার ব্যবস্থাপনা সিস্টেম',
    dashboard: 'ড্যাশবোর্ড',
    search: 'অনুসন্ধান',
    voters: 'ভোটার',
    halls: 'হল',
    analytics: 'বিশ্লেষণ',
    settings: 'সেটিংস',
    export: 'রপ্তানি',
    more: 'আরও',
    home: 'হোম',
    stats: 'পরিসংখ্যান',
    
    // Stats
    totalVoters: 'মোট ভোটার',
    totalHalls: 'মোট হল',
    activeSessions: 'সক্রিয় সেশন',
    performance: 'কর্মক্ষমতা',
    
    // Actions
    loadVoters: 'ভোটার লোড করুন',
    loadAll: 'সব লোড করুন',
    viewAll: 'সব দেখুন',
    selectAll: 'সব নির্বাচন করুন',
    deselectAll: 'নির্বাচন বাতিল',
    clearSearch: 'অনুসন্ধান মুছুন',
    reset: 'রিসেট',
    searchNow: 'অনুসন্ধান করুন',
    
    // Forms
    searchPlaceholder: 'নাম, আইডি, হল বা বিভাগ দ্বারা অনুসন্ধান...',
    enterName: 'নাম লিখুন',
    enterID: 'আইডি লিখুন',
    selectHall: 'হল নির্বাচন করুন',
    selectDepartment: 'বিভাগ নির্বাচন করুন',
    
    // Login
    username: 'ব্যবহারকারীর নাম',
    password: 'পাসওয়ার্ড',
    login: 'লগইন',
    logout: 'লগআউট',
    enterUsername: 'ব্যবহারকারীর নাম লিখুন',
    enterPassword: 'পাসওয়ার্ড লিখুন',
    
    // Messages
    welcome: 'স্বাগতম',
    loading: 'লোড হচ্ছে...',
    noResults: 'কোন ফলাফল পাওয়া যায়নি',
    resultsFound: 'ফলাফল পাওয়া গেছে',
    success: 'সফল',
    error: 'ত্রুটি',
    warning: 'সতর্কতা',
    info: 'তথ্য',
    
    // Export
    exportExcel: 'এক্সেল রপ্তানি',
    exportCSV: 'সিএসভি রপ্তানি',
    exportPDF: 'পিডিএফ রপ্তানি',
    generateReport: 'রিপোর্ট তৈরি করুন',
    
    // Quick Actions
    quickActions: 'দ্রুত কার্যক্রম',
    viewAnalytics: 'বিশ্লেষণ দেখুন',
    toggleDarkMode: 'ডার্ক মোড টগল করুন',
    help: 'সাহায্য',
    about: 'সম্পর্কে'
  },
  en: {
    // Main UI
    title: 'DUCSU Voter Management System',
    dashboard: 'Dashboard',
    search: 'Search',
    voters: 'Voters',
    halls: 'Halls',
    analytics: 'Analytics',
    settings: 'Settings',
    export: 'Export',
    more: 'More',
    home: 'Home',
    stats: 'Stats',
    
    // Stats
    totalVoters: 'Total Voters',
    totalHalls: 'Total Halls',
    activeSessions: 'Active Sessions',
    performance: 'Performance',
    
    // Actions
    loadVoters: 'Load Voters',
    loadAll: 'Load All',
    viewAll: 'View All',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    clearSearch: 'Clear Search',
    reset: 'Reset',
    searchNow: 'Search',
    
    // Forms
    searchPlaceholder: 'Search by name, ID, hall, or department...',
    enterName: 'Enter name',
    enterID: 'Enter ID',
    selectHall: 'Select Hall',
    selectDepartment: 'Select Department',
    
    // Login
    username: 'Username',
    password: 'Password',
    login: 'Login',
    logout: 'Logout',
    enterUsername: 'Enter username',
    enterPassword: 'Enter password',
    
    // Messages
    welcome: 'Welcome',
    loading: 'Loading...',
    noResults: 'No results found',
    resultsFound: 'results found',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    
    // Export
    exportExcel: 'Export to Excel',
    exportCSV: 'Export to CSV',
    exportPDF: 'Export to PDF',
    generateReport: 'Generate Report',
    
    // Quick Actions
    quickActions: 'Quick Actions',
    viewAnalytics: 'View Analytics',
    toggleDarkMode: 'Toggle Dark Mode',
    help: 'Help',
    about: 'About'
  }
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'bn',
      setLanguage: (lang) => set({ language: lang }),
      t: (key) => {
        const { language } = get()
        return (translations[language] as any)[key] || key
      }
    }),
    {
      name: 'language-storage',
    }
  )
)