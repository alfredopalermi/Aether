'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Tool } from '@/lib/types'

const RECENTS_KEY = 'ae_recents'

interface Props { open: boolean; onClose: () => void; tools: Tool[] }

export function SearchModal({ open, onClose, tools }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [focusIdx, setFocusIdx] = useState(-1)
  const [recents, setRecents] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try { setRecents(JSON.parse(localStorage.getItem(RECENTS_KEY) ?? '[]')) } catch {}
  }, [open])

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 60); setQuery(''); setFocusIdx(-1) }
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); open ? onClose() : null }
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const results = query.trim()
    ? tools.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.tagline.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase()) ||
        t.tags.some(x => x.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8)
    : []

  const addRecent = useCallback((q: string) => {
    if (!q.trim() || q.length < 2) return
    const next = [q, ...recents.filter(r => r !== q)].slice(0, 4)
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
    setRecents(next)
  }, [recents])

  const goToTool = (slug: string) => {
    addRecent(query)
    onClose()
    router.push(`/tool/${slug}`)
  }

  const clearRecents = () => {
    setRecents([])
    localStorage.removeItem(RECENTS_KEY)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    const items = document.querySelectorAll<HTMLElement>('[data-search-item]')
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIdx(i => Math.min(i + 1, items.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setFocusIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && focusIdx >= 0) items[focusIdx]?.click()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50"
         onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-[580px] bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-lg)] overflow-hidden flex flex-col max-h-[80vh]">

        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)] shrink-0">
          <span className="text-lg text-[var(--text-3)]">⌕</span>
          <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); setFocusIdx(-1) }}
                 onKeyDown={handleKey} placeholder="Search tools, categories, use cases…"
                 className="flex-1 bg-transparent text-base text-[var(--text)] outline-none placeholder:text-[var(--text-3)]" />
          <button onClick={onClose}
                  className="text-xs text-[var(--text-3)] bg-[var(--bg-2)] border border-[var(--border)] rounded px-2 py-0.5">Esc</button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {!query && recents.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-5 py-2 text-[10px] uppercase tracking-widest text-[var(--text-3)] font-bold">
                Recent searches
                <button onClick={clearRecents} className="font-normal normal-case tracking-normal text-[11px] hover:text-[var(--text)] transition-colors">Clear</button>
              </div>
              {recents.map(r => (
                <button key={r} data-search-item onClick={() => setQuery(r)}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-[var(--text-2)] hover:bg-[var(--accent-soft)] transition-colors text-left">
                  <span className="text-[var(--text-3)]">↺</span>{r}
                </button>
              ))}
              <div className="h-px bg-[var(--border-soft)] my-1" />
            </div>
          )}

          {!query && (
            <div>
              <div className="px-5 py-2 text-[10px] uppercase tracking-widest text-[var(--text-3)] font-bold">Recently Added</div>
              {[...tools].sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime()).slice(0, 4).map(t => (
                <SearchItem key={t.slug} tool={t} query="" focused={false} onClick={() => goToTool(t.slug)} />
              ))}
            </div>
          )}

          {query && results.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-[var(--text-3)]">
              No results for <strong>"{query}"</strong>
            </div>
          )}

          {results.map((t, i) => (
            <SearchItem key={t.slug} tool={t} query={query} focused={i === focusIdx} onClick={() => goToTool(t.slug)} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-4 px-5 py-2 border-t border-[var(--border)] text-[11px] text-[var(--text-3)] shrink-0">
          <span><kbd className="bg-[var(--bg-2)] border border-[var(--border)] rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="bg-[var(--bg-2)] border border-[var(--border)] rounded px-1">↵</kbd> open</span>
          <span><kbd className="bg-[var(--bg-2)] border border-[var(--border)] rounded px-1">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}

function SearchItem({ tool: t, query, focused, onClick }: { tool: Tool; query: string; focused: boolean; onClick: () => void }) {
  function hl(text: string) {
    if (!query) return text
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(re)
    return parts.map((p, i) => re.test(p) ? <mark key={i} className="bg-[var(--text)]/10 rounded-sm px-0.5">{p}</mark> : p)
  }
  return (
    <button data-search-item onClick={onClick}
            className={`w-full flex items-center gap-3 px-5 py-3 border-b border-[var(--border-soft)] last:border-0 transition-colors text-left ${focused ? 'bg-[var(--accent-soft)]' : 'hover:bg-[var(--accent-soft)]'}`}>
      <div className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] flex items-center justify-center text-sm shrink-0">{t.logo}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{hl(t.name)}</div>
        <div className="text-xs text-[var(--text-3)] truncate">{t.tagline}</div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className={`badge badge-${t.pricing.toLowerCase()}`}>{t.pricing}</span>
        <span className="text-[10px] text-[var(--text-3)]">{t.category}</span>
      </div>
    </button>
  )
}
