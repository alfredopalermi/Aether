'use client'
import { useState, useEffect, useCallback } from 'react'

const KEY = 'ae_notes'

export function useNotes() {
  const [notes, setNotes] = useState<Record<string, string>>({})

  useEffect(() => {
    try {
      setNotes(JSON.parse(localStorage.getItem(KEY) ?? '{}'))
    } catch { setNotes({}) }
  }, [])

  const saveNote = useCallback((slug: string, text: string) => {
    setNotes(prev => {
      const next = { ...prev }
      if (text.trim()) next[slug] = text
      else delete next[slug]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const getNote = (slug: string) => notes[slug] ?? ''
  const hasNote = (slug: string) => !!notes[slug]

  return { notes, saveNote, getNote, hasNote }
}
