'use client'
import Link from 'next/link'
import { Tool } from '@/lib/types'
import { isNew } from '@/lib/utils'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useCompare } from '@/hooks/useCompare'
import { useVisited } from '@/hooks/useVisited'
import { useNotes } from '@/hooks/useNotes'
import { useToast } from '@/components/ui/Toast'

interface CardProps {
  tool: Tool
  variant?: 's' | 'm' | 'l'
  onVote?: (slug: string) => Promise<void>
  hasVoted?: boolean
}

export function ToolCard({ tool: t, variant = 'm', onVote, hasVoted }: CardProps) {
  const { isBookmarked, toggle: toggleBm } = useBookmarks()
  const { isInCompare, toggle: toggleCmp } = useCompare()
  const { hasVisited } = useVisited()
  const { hasNote } = useNotes()
  const { toast } = useToast()

  const bm = isBookmarked(t.slug)
  const cmp = isInCompare(t.slug)
  const visited = hasVisited(t.slug)
  const noted = hasNote(t.slug)

  const handleBm = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    toggleBm(t.slug)
    toast(bm ? 'Removed from saved' : 'Saved ♥')
  }

  const handleCmp = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const result = toggleCmp(t.slug)
    if (result === 'max') toast('Max 3 tools to compare')
    else if (result === 'added') toast('Added to compare ⊕')
    else toast('Removed from compare')
  }

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    onVote?.(t.slug)
    toast(hasVoted ? 'Vote removed' : '♥ Voted!')
  }

  const pricingClass = `badge badge-${t.pricing.toLowerCase()}`
  const fresh = isNew(t.added_at)

  const Actions = () => (
    <div className="flex items-center gap-1">
      <button onClick={handleVote}
              className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs transition-all font-medium
                ${hasVoted ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-3)] hover:border-red-300 hover:text-red-500'}`}>
        ♥ <span>{t.votes ?? 0}</span>
      </button>
      <button onClick={handleCmp}
              className={`w-7 h-7 rounded-md border flex items-center justify-center text-xs transition-all
                ${cmp ? 'bg-blue-50 border-blue-300 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-3)] hover:border-[var(--text-3)]'}`}>
        ⊕
      </button>
      <button onClick={handleBm}
              className={`w-7 h-7 rounded-md border flex items-center justify-center text-xs transition-all
                ${bm ? 'bg-[var(--text)] text-[var(--text-inv)] border-[var(--text)]' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-3)] hover:border-[var(--text-3)]'}`}>
        {bm ? '♥' : '♡'}
      </button>
    </div>
  )

  if (variant === 's') return (
    <Link href={`/tool/${t.slug}`}
          className={`card-base p-[18px] flex flex-col gap-2.5 ${bm ? 'after:content-[""] after:absolute after:top-0 after:right-0 after:border-[0_18px_18px_0] after:border-[transparent_var(--text)_transparent_transparent] after:rounded-tr-xl' : ''} ${noted ? 'before:content-[""] before:absolute before:bottom-3 before:right-3 before:w-[5px] before:h-[5px] before:rounded-full before:bg-blue-500 before:opacity-70' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-[9px] border border-[var(--border)] bg-[var(--accent-soft)] flex items-center justify-center text-sm shrink-0">{t.logo}</div>
        <Actions />
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {t.featured && <span className="badge badge-featured">✦</span>}
        <span className={pricingClass}>{t.pricing}</span>
      </div>
      <div className={`text-sm font-semibold tracking-tight ${visited ? 'after:content-["✓"] after:text-xs after:text-[var(--text-3)] after:font-normal after:ml-1' : ''}`}>
        {t.name}
      </div>
      <div className="text-[13px] text-[var(--text-2)] leading-relaxed">{t.tagline}</div>
      <div className="flex items-center justify-between mt-auto pt-0.5">
        <span className="text-[11px] text-[var(--text-3)]">{t.category}</span>
        {fresh ? <span className="text-[11px] text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />New</span>
               : <span className="text-[12px] text-[var(--text-3)]">→</span>}
      </div>
    </Link>
  )

  if (variant === 'l') return (
    <Link href={`/tool/${t.slug}`}
          className={`card-base p-7 flex flex-col gap-3 overflow-hidden ${bm ? 'after:content-[""] after:absolute after:top-0 after:right-0 after:border-[0_20px_20px_0] after:border-[transparent_var(--text)_transparent_transparent] after:rounded-tr-xl' : ''}`}>
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-[0.04] bg-[var(--text)] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="flex items-start justify-between gap-2 relative">
        <div className="w-11 h-11 rounded-[12px] border border-[var(--border)] bg-[var(--accent-soft)] flex items-center justify-center text-xl shrink-0">{t.logo}</div>
        <Actions />
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {t.featured && <span className="badge badge-featured">✦ Featured</span>}
        <span className={pricingClass}>{t.pricing}</span>
      </div>
      <div className="text-[17px] font-semibold tracking-tight">{t.name}</div>
      <div className="text-[13px] text-[var(--text-2)] leading-relaxed max-w-xs">{t.tagline}</div>
      {t.editorial && <div className="text-[13px] text-[var(--text-2)] leading-relaxed italic line-clamp-2">"{t.editorial}"</div>}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-[11px] text-[var(--text-3)]">{t.category}</span>
        <span className="text-[12px] text-[var(--text-3)]">Open →</span>
      </div>
    </Link>
  )

  // Default: M
  return (
    <Link href={`/tool/${t.slug}`}
          className={`card-base p-5 flex flex-col gap-2.5 ${bm ? 'after:content-[""] after:absolute after:top-0 after:right-0 after:border-[0_18px_18px_0] after:border-[transparent_var(--text)_transparent_transparent] after:rounded-tr-xl' : ''} ${noted ? 'before:content-[""] before:absolute before:bottom-3 before:right-3 before:w-[5px] before:h-[5px] before:rounded-full before:bg-blue-500 before:opacity-70' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[9px] border border-[var(--border)] bg-[var(--accent-soft)] flex items-center justify-center text-sm shrink-0">{t.logo}</div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              {t.featured && <span className="badge badge-featured">✦</span>}
              <span className={pricingClass}>{t.pricing}</span>
            </div>
            <div className={`text-sm font-semibold tracking-tight ${visited ? 'after:content-["✓"] after:text-[10px] after:text-[var(--text-3)] after:font-normal after:ml-1' : ''}`}>
              {t.name}
            </div>
          </div>
        </div>
        <Actions />
      </div>
      <div className="text-[13px] text-[var(--text-2)] leading-relaxed">{t.tagline}</div>
      <div className="flex items-center justify-between mt-auto pt-0.5">
        <span className="text-[11px] text-[var(--text-3)]">{t.category}</span>
        {fresh ? <span className="text-[11px] text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />New</span>
               : <span className="text-[12px] text-[var(--text-3)]">→</span>}
      </div>
    </Link>
  )
}
