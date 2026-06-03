import React from 'react'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'docs', label: 'Docs only' },
]

export default function FilterBar({ active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap mb-5">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            active === f.value
              ? 'bg-brand text-white border-brand'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
