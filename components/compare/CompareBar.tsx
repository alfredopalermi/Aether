'use client'
import Link from 'next/link'
import { useCompare } from '@/hooks/useCompare'
import type { Tool } from '@/lib/types'

interface Props { tools: Tool[] }

export function CompareBar({ tools }: Props) {
  const { compareList, clear, count } = useCompare()
  if (count === 0) return null

  const selected = compareList.map(slug => tools.find(t => t.slug === slug)).filter(Boolean) as Tool[]

  return (
    <>
      {/* Desktop bar */}
      <div className="hidden md:flex fixed bottom-0 left-0 right-0 z-30 items-center gap-3 px-6 py-3 bg-[var(--text)] text-[var(--text-inv)] border-t border-white/10 shadow-[var(--shadow-lg)]"
           style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom,0px))' }}>
        <div className="flex gap-2 flex-1">
          {selected.map(t => (
            <div key={t.slug} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 text-sm">
              <span>{t.logo}</span>
              <span className="font-medium">{t.name}</span>
            </div>
          ))}
          {Array.from({ length: 3 - count }).map((_, i) => (
            <div key={i} className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-dashed border-white/20 text-sm text-white/40 min-w-[120px]">
              + Add a tool
            </div>
          ))}
        </div>
        <span className="text-xs text-white/40">{count}/3</span>
        <button onClick={clear} className="px-3 py-1.5 rounded-lg border border-white/15 text-sm text-white/50 hover:text-white hover:border-white/35 transition-all">Clear</button>
        {count >= 2 && (
          <Link href="/compare" className="px-4 py-1.5 rounded-lg bg-white text-[#111] text-sm font-semibold hover:opacity-90 transition-opacity">
            Compare →
          </Link>
        )}
      </div>

      {/* Mobile pill */}
      <Link href="/compare"
            className="md:hidden fixed z-30 right-5 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--text)] text-[var(--text-inv)] text-sm font-semibold shadow-[var(--shadow-lg)]"
            style={{ bottom: 'calc(20px + env(safe-area-inset-bottom,0px))' }}>
        ⊕ Compare {count} {count === 1 ? 'tool' : 'tools'}
      </Link>
    </>
  )
}
