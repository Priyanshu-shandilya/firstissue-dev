import React from 'react'

const LANG_COLORS = {
  python: 'bg-blue-50 text-blue-700 border-blue-200',
  javascript: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  typescript: 'bg-blue-50 text-blue-800 border-blue-300',
  rust: 'bg-orange-50 text-orange-700 border-orange-200',
  go: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  default: 'bg-gray-50 text-gray-600 border-gray-200',
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function IssueCard({ issue }) {
  const langKey = issue.language?.toLowerCase() || 'default'
  const langClass = LANG_COLORS[langKey] || LANG_COLORS.default

  return (
    <a
      href={issue.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card block hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 leading-snug line-clamp-2 mb-1">
            {issue.title}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            <span className="font-medium text-gray-700">{issue.repoFullName}</span>
            <span>{timeAgo(issue.createdAt)}</span>
            <span>💬 {issue.commentsCount}</span>
          </div>
          <div className="flex gap-1.5 flex-wrap mt-2">
            {issue.language && (
              <span className={`badge ${langClass}`}>{issue.language}</span>
            )}
            {issue.labels.slice(0, 3).map((label) => (
              <span
                key={label}
                className="badge bg-brand-light text-brand-dark border-green-200"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap shrink-0">
          <span className="text-yellow-500">★</span>
          {issue.repoStars >= 1000
            ? `${(issue.repoStars / 1000).toFixed(1)}k`
            : issue.repoStars}
        </div>
      </div>
    </a>
  )
}
