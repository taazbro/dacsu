'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Search, X } from 'lucide-react'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')

  const commands = [
    { id: 1, name: 'Search Voters', shortcut: 'Ctrl+F' },
    { id: 2, name: 'Export to Excel', shortcut: 'Ctrl+E' },
    { id: 3, name: 'View Analytics', shortcut: '' },
    { id: 4, name: 'Toggle Dark Mode', shortcut: 'Ctrl+D' },
    { id: 5, name: 'View All Halls', shortcut: '' },
    { id: 6, name: 'Generate Report', shortcut: '' },
  ]

  const filteredCommands = commands.filter(cmd =>
    cmd.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-12 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Type a command or search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  onClick={onClose}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {filteredCommands.length > 0 && (
                <div className="max-h-80 scroll-py-2 overflow-y-auto py-2">
                  {filteredCommands.map((command) => (
                    <button
                      key={command.id}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                      onClick={() => {
                        console.log('Execute:', command.name)
                        onClose()
                      }}
                    >
                      <span className="text-gray-900 dark:text-white">
                        {command.name}
                      </span>
                      {command.shortcut && (
                        <span className="text-xs text-gray-400">
                          {command.shortcut}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}