'use client'

import { useLanguageStore } from '@/store/language'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore()

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
      <button
        onClick={() => setLanguage('bn')}
        className={`px-4 py-2 rounded-full transition-all ${
          language === 'bn'
            ? 'bg-vezran-primary text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        বাংলা
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 rounded-full transition-all ${
          language === 'en'
            ? 'bg-vezran-primary text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        English
      </button>
    </div>
  )
}