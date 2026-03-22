'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ToolCard } from '@/components/tools/ToolCard'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useVotes } from '@/hooks/useVotes'
import { useToast } from '@/components/ui/Toast'
import { toolsToCSV, toolsToMarkdown, toolsToText } from '@/lib/utils'
import type { Tool } from '@/lib/types'

interface Props { tools: Tool[] }

export function BookmarksClient({ tools }: Props) {
  const { bookmarks } = useBookmarks()
  const initialVotes = Object.fromEntries(tools.map(t => [t.slug, t.votes ?? 0]))
  const { getVotes, hasVoted, toggle: toggleVote } = useVotes(initialVotes)
  const { toast } = useToast()
  const [exportOpen, setExportOpen] = useState(false)

  const saved = tools.filter(t => bookmarks.includes(t.slug))

  const handleVote = async (slug: string) => {
    await toggleVote(slug)
    toast(hasVoted(slug) ? 'Vote removed' : '♥ Voted!')
  }

  const doExport = (format: 'csv' | 'markdown' | 'text' | 'clipboard') => {
    if (saved.length === 0) { toast('No saved tools to export'); return }
    let content = '', filename = '', mime = ''

    if (format === 'csv') {
      content = toolsToCSV(saved); filename = 'aether-saved.csv'; mime = 'text/csv'
    } else if (format === 'markdown') {
      content = toolsToMarkdown(saved); filename = 'aether-saved.md'; mime = 'text/markdown'
    } else if (format === 'text') {
      content = toolsToText(saved); filename = 'aether-saved.txt'; mime = 'text/plain'
    } else if (format === 'clipboard') {
      navigator.clipboard.writeText(toolsToMarkdown(saved))
        .then(() => toast('Copied to clipboard ✓'))
        .catch(() => toast('Copy failed'))
      setExportOpen(false)
      return
    }

    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
    toast(`Exported ${saved.length} tools as ${format.toUpperCase()} ✓`)
    setExportOpen(false)
  }

  return (
    <main className="max-w-[1160px] mx-auto px-6 py-8 pb-24">
      <div className="mb-8 pb-6 border-b border-[var(--border-soft)]">
        <div className="text-sm text-[var(--text-3)] mb-2">Home / Saved</div>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="page-title mb-1.5">Saved Tools</h1>
            <p className="text-sm text-[var(--text-2)] font-light">Your personal shortlist, saved in this browser.</p>
          </div>
          {saved.length > 0 && (
            <div className="relative">
              <button onClick={() => setExportOpen(!exportOpen)} className="btn-ghost mt-2">↗ Export</button>
              {exportOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-md)] overflow-hidden z-20">
                  {[
                    { label: '📄 CSV Spreadsheet', format: 'csv' as const },
                    { label: '◈ Markdown List', format: 'markdown' as const },
                    { label: '✎ Plain Text', format: 'text' as const },
                    { label: '⊕ Copy to Clipboard', format: 'clipboard' as const },
                  ].map(opt => (
                    <button key={opt.format} onClick={() => doExport(opt.format)}
                            className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-2)] hover:bg-[var(--accent-soft)] hover:text-[var(--text)] transition-colors">
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-3)]">
          <div className="text-4xl mb-4 opacity-35">♡</div>
          <h3 className="text-lg font-serif text-[var(--text-2)] mb-2">Nothing saved yet</h3>
          <p className="text-sm mb-6">Hit ♡ on any tool card to save it here.</p>
          <Link href="/directory" className="btn-ghost">Browse Directory →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {saved.map(t => (
            <ToolCard key={t.slug}
              tool={{ ...t, votes: getVotes(t.slug) }}
              variant="m"
              onVote={handleVote}
              hasVoted={hasVoted(t.slug)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
