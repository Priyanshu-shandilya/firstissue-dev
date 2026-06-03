import React, { useEffect, useState } from 'react'
import { getStats, getSubscriberCount } from '../api'

export default function StatsBar() {
  const [stats, setStats] = useState({ totalIssues: '—', totalRepos: '—' })
  const [subscribers, setSubscribers] = useState('—')

  useEffect(() => {
    getStats()
      .then((r) => setStats(r.data))
      .catch(() => {})

    getSubscriberCount()
      .then((r) => setSubscribers(r.data.count))
      .catch(() => {})
  }, [])

  const items = [
    { label: 'Open issues today', value: typeof stats.totalIssues === 'number' ? stats.totalIssues.toLocaleString() : stats.totalIssues },
    { label: 'Repos tracked', value: typeof stats.totalRepos === 'number' ? stats.totalRepos.toLocaleString() : stats.totalRepos },
    { label: 'Subscribers', value: typeof subscribers === 'number' ? subscribers.toLocaleString() : subscribers },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {items.map((item) => (
        <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">{item.label}</div>
          <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
        </div>
      ))}
    </div>
  )
}
