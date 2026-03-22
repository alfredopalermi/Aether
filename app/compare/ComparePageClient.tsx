'use client'
import Link from 'next/link'
import { useCompare } from '@/hooks/useCompare'
import { useVotes } from '@/hooks/useVotes'
import type { Tool } from '@/lib/types'

interface Props { tools: Tool[] }

const ROWS = [
  { label: 'Category',   fn: (t: Tool) => t.category },
  { label: 'Pricing',    fn: (t: Tool) => t.pricing },
  { label: 'Votes',      fn: (t: Tool, votes: number) => String(votes) },
  { label: 'Best for',   fn: (t: Tool) => t.use_cases.slice(0, 3).join(', ') },
  { label: 'Strengths',  fn: (t: Tool) => t.pros },
  { label: 'Limitations',fn: (t: Tool) => t.cons },
  { label: 'Tags',       fn: (t: Tool) => t.tags },
]

export function ComparePageClient({ tools }: Props) {
  const { compareList, clear } = useCompare()
  const initialVotes = Object.fromEntries(tools.map(t => [t.slug, t.votes ?? 0]))
  const { getVotes } = useVotes(initialVotes)

  const selected = compareList.map(slug => tools.find(t => t.slug === slug)).filter(Boolean) as Tool[]

  if (selected.length < 2) {
    return (
      <main className="max-w-[1160px] mx-auto px-6 py-8 pb-24">
        <div className="mb-8 pb-6 border-b border-[var(--border-soft)]">
          <div className="text-sm text-[var(--text-3)] mb-2">Home / Compare</div>
          <h1 className="page-title mb-1.5">Side-by-Side</h1>
          <p className="text-sm text-[var(--text-2)] font-light">Add up to 3 tools with ⊕, then compare them head to head.</p>
        </div>
        <div className="text-center py-20 text-[var(--text-3)]">
          <div className="text-4xl mb-4 opacity-35">⊕</div>
          <h3 className="text-base font-medium text-[var(--text-2)] mb-2">Add at least 2 tools to compare</h3>
          <p className="text-sm mb-6">Use the ⊕ button on any tool card, then return here.</p>
          <Link href="/directory" className="btn-ghost">Browse Directory →</Link>
        </div>
      </main>
    )
  }

  const cols = selected.length

  return (
    <main className="max-w-[1160px] mx-auto px-6 py-8 pb-24">
      <div className="mb-8 pb-6 border-b border-[var(--border-soft)]">
        <div className="text-sm text-[var(--text-3)] mb-2">Home / Compare</div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="page-title mb-1.5">Side-by-Side</h1>
            <p className="text-sm text-[var(--text-2)] font-light">Comparing {cols} tools</p>
          </div>
          <button onClick={clear} className="btn-ghost">Clear all</button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block border border-[var(--border)] rounded-xl overflow-hidden mb-4">
        {/* Tool headers */}
        <div className="grid border-b-2 border-[var(--border)]"
             style={{ gridTemplateColumns: `140px repeat(${cols}, 1fr)` }}>
          <div className="bg-[var(--bg-2)]" />
          {selected.map(t => (
            <div key={t.slug} className="p-5 bg-[var(--surface)] border-l border-[var(--border)] flex flex-col gap-2">
              <div className="w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--accent-soft)] flex items-center justify-center text-base">{t.logo}</div>
              <div className="text-[15px] font-semibold">{t.name}</div>
              <div className="text-xs text-[var(--text-3)] leading-relaxed">{t.tagline}</div>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                <a href={t.website} target="_blank" rel="noopener noreferrer" className="btn-solid text-xs py-1 px-2.5">Visit →</a>
                <Link href={`/tool/${t.slug}`} className="btn-ghost text-xs py-1 px-2.5">Details</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Data rows */}
        {ROWS.map(row => (
          <div key={row.label} className="grid border-b border-[var(--border-soft)] last:border-0"
               style={{ gridTemplateColumns: `140px repeat(${cols}, 1fr)` }}>
            <div className="px-4 py-3.5 bg-[var(--bg-2)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)] flex items-center">
              {row.label}
            </div>
            {selected.map(t => {
              const val = row.fn(t, getVotes(t.slug))
              return (
                <div key={t.slug} className="px-4 py-3.5 border-l border-[var(--border-soft)] text-sm text-[var(--text-2)]">
                  {Array.isArray(val)
                    ? <ul className="space-y-0.5">{val.map((v, i) => <li key={i} className="text-[12px]">{v}</li>)}</ul>
                    : val}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-4">
        {selected.map(t => (
          <div key={t.slug} className="border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-[var(--border)] bg-[var(--surface)]">
              <div className="w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--accent-soft)] flex items-center justify-center text-base shrink-0">{t.logo}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-[var(--text-3)] truncate">{t.tagline}</div>
              </div>
              <a href={t.website} target="_blank" rel="noopener noreferrer" className="btn-solid text-xs py-1 px-2.5 shrink-0">Visit →</a>
            </div>
            {ROWS.map(row => {
              const val = row.fn(t, getVotes(t.slug))
              return (
                <div key={row.label} className="flex gap-3 px-4 py-3 border-b border-[var(--border-soft)] last:border-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)] min-w-[90px] shrink-0 pt-0.5">{row.label}</span>
                  <div className="text-sm text-[var(--text-2)] flex-1">
                    {Array.isArray(val)
                      ? <ul className="space-y-0.5">{val.map((v, i) => <li key={i} className="text-[12px]">{v}</li>)}</ul>
                      : val}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl mt-4 flex-wrap gap-3">
        <p className="text-sm text-[var(--text-2)]">Add more tools with ⊕ from the directory.</p>
        <Link href="/directory" className="btn-ghost text-sm">Browse Directory →</Link>
      </div>
    </main>
  )
}
