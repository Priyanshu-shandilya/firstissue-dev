import React, { useState } from 'react'
import StatsBar from '../components/StatsBar'
import FilterBar from '../components/FilterBar'
import IssuesList from '../components/IssuesList'
import SubscribeForm from '../components/SubscribeForm'

export default function HomePage() {
  const [filter, setFilter] = useState('all')

  return (
    <>
      <StatsBar />
      <FilterBar active={filter} onChange={setFilter} />
      <IssuesList filter={filter} />
      <SubscribeForm />
    </>
  )
}
