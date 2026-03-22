'use client'
import Link from 'next/link'
import { Tool } from '@/lib/types'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useVisited } from '@/hooks/useVisited'
import { useToast } from '@/components/ui/Toast'

interface Props { tool: Tool; onVote?: (slug: string) => Promise<void>; hasVoted?: boolean }

export function ToolListItem({ tool: t, onVote, hasVoted }: Props) {
  const { isBookmarked, toggle: toggleBm } = useBookmarks()
  const { hasVisited } = useVisited()
  const { toast } = useToast()
  const bm = isBookmarked(t.slug)
  const visited = hasVisited(t.slug)

  return (
    <Link href={`/tool/${t.slug}`}
          className={`flex items-center gap-3.5 px-4 py-3 bg-[var(--surface)] border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--accent-soft)] transition-colors relative ${bm ? 'border-l-2 border-l-[var(--text)] pl-3.5' : ''}`}>
      <div className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] flex items-center justify-center text-sm shrink-0">{t.logo}</div>
      <div className={`text-sm font-semibold min-w-[130px] shrink-0 ${visited ? 'after:content-["✓"] after:text-[10px] after:text-[var(--text-3)] after:font-normal after:ml-1' : ''}`}>
        {t.name}
      </div>
      <div className="text-sm text-[var(--text-2)] flex-1 truncate hidden sm:block">{t.tagline}</div>
      <div className="flex items-center gap-2 ml-auto shrink-0">
        <span className={`badge badge-${t.pricing.toLowerCase()}`}>{t.pricing}</span>
        <span className="text-[11px] text-[var(--text-3)] hidden sm:block">{t.category}</span>
        <button onClick={e => { e.preventDefault(); e.stopPropagation(); onVote?.(t.slug); toast(hasVoted ? 'Vote removed' : '♥ Voted!') }}
                className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs transition-all ${hasVoted ? 'bg-red-50 border-red-200 text-red-600' : 'border-[var(--border)] text-[var(--text-3)] hover:border-red-300 hover:text-red-500'}`}>
          ♥ {t.votes ?? 0}
        </button>
        <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleBm(t.slug); toast(bm ? 'Removed' : 'Saved ♥') }}
                className={`w-7 h-7 rounded-md border flex items-center justify-center text-xs transition-all ${bm ? 'bg-[var(--text)] text-[var(--text-inv)] border-[var(--text)]' : 'border-[var(--border)] text-[var(--text-3)] hover:border-[var(--text-3)]'}`}>
          {bm ? '♥' : '♡'}
        </button>
      </div>
    </Link>
  )
}
