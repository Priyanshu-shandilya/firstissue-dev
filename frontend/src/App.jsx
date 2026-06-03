import React, { useState } from 'react'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import UnsubscribePage from './pages/UnsubscribePage'

export default function App() {
  // Simple client-side routing without react-router
  const path = window.location.pathname

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {path.startsWith('/unsubscribe') ? <UnsubscribePage /> : <HomePage />}
      </main>
      <footer className="text-center text-xs text-gray-400 py-8">
        Built with 💚 · Issues fetched from GitHub every 24h via cron
      </footer>
    </div>
  )
}
