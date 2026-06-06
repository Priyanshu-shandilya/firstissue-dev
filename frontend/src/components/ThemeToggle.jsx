import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-20 h-10 rounded-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-all duration-500 shadow-inner"
    >
      <span
        className={`absolute top-1 left-1 w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
          theme === 'dark'
            ? 'translate-x-10 bg-gray-950 text-yellow-300 rotate-180'
            : 'translate-x-0 bg-white text-yellow-500 rotate-0'
        }`}
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
    </button>
  )
}