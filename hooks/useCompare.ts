'use client'
import { useState, useEffect, useCallback } from 'react'

const KEY = 'ae_cmp'
const MAX = 3

export function useCompare() {
  const [compareList, setCompareList] = useState<string[]>([])

  useEffect(() => {
    try {
      setCompareList(JSON.parse(sessionStorage.getItem(KEY) ?? '[]'))
    } catch { setCompareList([]) }
  }, [])

  const toggle = useCallback((slug: string): 'added' | 'removed' | 'max' => {
    let result: 'added' | 'removed' | 'max' = 'added'
    setCompareList(prev => {
      if (prev.includes(slug)) {
        result = 'removed'
        const next = prev.filter(s => s !== slug)
        sessionStorage.setItem(KEY, JSON.stringify(next))
        return next
      }
      if (prev.length >= MAX) { result = 'max'; return prev }
      result = 'added'
      const next = [...prev, slug]
      sessionStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
    return result
  }, [])

  const clear = useCallback(() => {
    setCompareList([])
    sessionStorage.removeItem(KEY)
  }, [])

  const isInCompare = (slug: string) => compareList.includes(slug)

  return { compareList, toggle, clear, isInCompare, count: compareList.length }
}
