'use client'
import { useState, useEffect, useCallback } from 'react'

const KEY = 'ae_bm'

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([])

  useEffect(() => {
    try {
      setBookmarks(JSON.parse(localStorage.getItem(KEY) ?? '[]'))
    } catch { setBookmarks([]) }
  }, [])

  const toggle = useCallback((slug: string) => {
    setBookmarks(prev => {
      const next = prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isBookmarked = (slug: string) => bookmarks.includes(slug)

  return { bookmarks, toggle, isBookmarked }
}
