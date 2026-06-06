import React from 'react'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import UnsubscribePage from './pages/UnsubscribePage'
import ThemeToggle from './components/ThemeToggle'

export default function App() {
  const path = window.location.pathname

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-500">
      <Header />

      <div className="max-w-4xl mx-auto px-4 pt-4 flex justify-end">
        <ThemeToggle />
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {path.startsWith('/unsubscribe') ? <UnsubscribePage /> : <HomePage />}
      </main>

      <footer className="text-center text-xs text-gray-500 dark:text-gray-400 py-8">
        Built with 💚 · Issues fetched from GitHub every 24h via cron
      </footer>
    </div>
  )
}