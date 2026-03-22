'use client'
import { useState, useEffect, useCallback } from 'react'

const KEY = 'ae_visited'

export function useVisited() {
  const [visited, setVisited] = useState<string[]>([])

  useEffect(() => {
    try {
      setVisited(JSON.parse(localStorage.getItem(KEY) ?? '[]'))
    } catch { setVisited([]) }
  }, [])

  const markVisited = useCallback((slug: string) => {
    setVisited(prev => {
      if (prev.includes(slug)) return prev
      const next = [...prev, slug]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const hasVisited = (slug: string) => visited.includes(slug)

  return { visited, markVisited, hasVisited }
}
