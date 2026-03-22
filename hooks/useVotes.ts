'use client'
import { useState, useEffect, useCallback } from 'react'

const MY_KEY = 'ae_myvotes'

export function useVotes(initialVotes: Record<string, number> = {}) {
  const [votes, setVotes] = useState<Record<string, number>>(initialVotes)
  const [myVotes, setMyVotes] = useState<string[]>([])

  useEffect(() => {
    try {
      setMyVotes(JSON.parse(localStorage.getItem(MY_KEY) ?? '[]'))
    } catch { setMyVotes([]) }
    setVotes(initialVotes)
  }, [])

  const toggle = useCallback(async (slug: string): Promise<'voted' | 'unvoted'> => {
    const hasVoted = myVotes.includes(slug)
    const action = hasVoted ? 'decrement' : 'increment'

    // Optimistic update
    setVotes(prev => ({
      ...prev,
      [slug]: Math.max(0, (prev[slug] ?? 0) + (hasVoted ? -1 : 1)),
    }))
    setMyVotes(prev => {
      const next = hasVoted ? prev.filter(s => s !== slug) : [...prev, slug]
      localStorage.setItem(MY_KEY, JSON.stringify(next))
      return next
    })

    // Sync with API
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action }),
      })
      if (res.ok) {
        const { count } = await res.json()
        setVotes(prev => ({ ...prev, [slug]: count }))
      }
    } catch { /* optimistic update stands */ }

    return hasVoted ? 'unvoted' : 'voted'
  }, [myVotes])

  const getVotes = (slug: string) => votes[slug] ?? 0
  const hasVoted = (slug: string) => myVotes.includes(slug)
  const total = Object.values(votes).reduce((a, b) => a + b, 0)

  return { votes, toggle, getVotes, hasVoted, total }
}
