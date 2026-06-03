import React, { useEffect, useState } from 'react'
import { getIssues } from '../api'
import IssueCard from './IssueCard'

export default function IssuesList({ filter }) {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [lastSynced, setLastSynced] = useState(null)

  useEffect(() => {
    setPage(1)
  }, [filter])

  useEffect(() => {
    setLoading(true)
    setError(null)

    getIssues({ language: filter, page, limit: 10 })
      .then((r) => {
        setIssues(r.data.issues)
        setTotalPages(r.data.totalPages)
        setLastSynced(new Date().toLocaleTimeString())
      })
      .catch(() => setError('Could not load issues. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [filter, page])

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card animate-pulse h-24 bg-gray-100" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="card text-center py-10 text-red-500">
        <p className="text-2xl mb-2">⚠️</p>
        <p className="font-medium">{error}</p>
        <p className="text-sm text-gray-500 mt-1">Make sure your backend server is running on port 5000.</p>
      </div>
    )
  }

  if (issues.length === 0) {
    return (
      <div className="card text-center py-10 text-gray-500">
        <p className="text-2xl mb-2">🔍</p>
        <p>No issues found for this filter.</p>
        <p className="text-sm mt-1">Try selecting "All" or wait for the next cron sync.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-700">Browse issues</p>
        {lastSynced && (
          <p className="text-xs text-gray-400">Fetched at {lastSynced}</p>
        )}
      </div>

      <div className="space-y-3 mb-5">
        {issues.map((issue) => (
          <IssueCard key={issue._id} issue={issue} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-primary text-sm"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-primary text-sm"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
