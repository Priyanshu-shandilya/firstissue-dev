import React, { useState } from 'react'
import { subscribe } from '../api'

const TOPICS = ['Python', 'JavaScript', 'TypeScript', 'Rust', 'Go', 'C++', 'Docs']

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [selectedTopics, setSelectedTopics] = useState(['Python', 'JavaScript'])
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  function toggleTopic(topic) {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    try {
      await subscribe({ email, languages: selectedTopics, frequency })
      setStatus('success')
      const when = frequency === 'daily' ? 'tomorrow' : 'next Monday'
      setMessage(`Subscribed! Your first ${frequency} digest arrives ${when}. Check your inbox.`)
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err.response?.data?.error || 'Subscription failed. Please try again.')
    }
  }

  // Next cron run time
  const now = new Date()
  const nextRun = new Date(now)
  nextRun.setUTCHours(24, 0, 0, 0)
  const hoursUntil = Math.floor((nextRun - now) / 3600000)
  const minsUntil = Math.floor(((nextRun - now) % 3600000) / 60000)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mt-8">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">📬</span>
        <h2 className="font-semibold text-gray-900">Email Digest Subscription</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Get a curated digest straight to your inbox. Powered by a cron job that fetches
        fresh issues from GitHub every 24 hours automatically.
      </p>

      {/* Topic toggles */}
      <p className="text-xs font-medium text-gray-600 mb-2">Filter by language / topic</p>
      <div className="flex gap-2 flex-wrap mb-4">
        {TOPICS.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => toggleTopic(topic)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              selectedTopics.includes(topic)
                ? 'bg-brand text-white border-brand'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-3">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 min-w-[200px] text-sm px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
        />
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <option value="daily">Daily digest</option>
          <option value="weekly">Weekly digest</option>
        </select>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary text-sm"
        >
          {status === 'loading' ? 'Subscribing…' : '🔔 Subscribe'}
        </button>
      </form>

      {/* Status message */}
      {status === 'success' && (
        <div className="text-sm text-brand bg-brand-light border border-green-200 rounded-lg px-3 py-2 mb-3">
          ✅ {message}
        </div>
      )}
      {status === 'error' && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
          ⚠️ {message}
        </div>
      )}

      {/* Cron info */}
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
        <span>🔄</span>
        <span>
          GitHub API polled every <strong>24 hours</strong> via cron job — your digest is always
          fresh. Next run in <strong>{hoursUntil}h {minsUntil}m</strong>.
        </span>
      </div>
    </div>
  )
}
