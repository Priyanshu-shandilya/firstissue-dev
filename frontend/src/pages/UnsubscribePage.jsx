import React, { useEffect, useState } from 'react'
import api from '../api'

export default function UnsubscribePage() {
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (!token) {
      setStatus('error')
      setMessage('No unsubscribe token found in the URL.')
      return
    }

    api
      .get(`/subscribe/unsubscribe?token=${token}`)
      .then((r) => {
        setStatus('success')
        setMessage(r.data.message)
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err.response?.data?.error || 'Unsubscribe failed.')
      })
  }, [])

  return (
    <div className="max-w-md mx-auto mt-20 card text-center py-12 px-8">
      {status === 'loading' && (
        <>
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-600">Processing your unsubscribe request…</p>
        </>
      )}
      {status === 'success' && (
        <>
          <div className="text-4xl mb-4">✅</div>
          <h2 className="font-semibold text-gray-900 mb-2">You've been unsubscribed</h2>
          <p className="text-sm text-gray-500">{message}</p>
          <a href="/" className="btn-primary inline-block mt-6 text-sm">
            Back to FirstIssue.dev
          </a>
        </>
      )}
      {status === 'error' && (
        <>
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="font-semibold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500">{message}</p>
        </>
      )}
    </div>
  )
}
