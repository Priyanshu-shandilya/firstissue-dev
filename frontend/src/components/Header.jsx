import React from 'react'

export default function Header() {
  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center text-white text-lg">
            🌱
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white leading-tight">FirstIssue.dev</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Good first issues, curated daily</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full transition-colors duration-500">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse inline-block"></span>
          Auto-refreshed every 24h
        </div>
      </div>
    </header>
  )
}