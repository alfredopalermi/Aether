'use client'
import { ToolCard } from '@/components/tools/ToolCard'
import { useVotes } from '@/hooks/useVotes'
import { CATEGORIES } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'
import type { Tool } from '@/lib/types'

interface Props { tools: Tool[] }

export function CategoriesClient({ tools }: Props) {
  const initialVotes = Object.fromEntries(tools.map(t => [t.slug, t.votes ?? 0]))
  const { getVotes, hasVoted, toggle: toggleVote } = useVotes(initialVotes)
  const { toast } = useToast()

  const handleVote = async (slug: string) => {
    await toggleVote(slug)
    toast(hasVoted(slug) ? 'Vote removed' : '♥ Voted!')
  }

  return (
    <main className="max-w-[1160px] mx-auto px-6 py-8 pb-24">
      <div className="mb-8 pb-6 border-b border-[var(--border-soft)]">
        <div className="text-sm text-[var(--text-3)] mb-2">Home / Categories</div>
        <h1 className="page-title mb-1.5">Browse Categories</h1>
        <p className="text-sm text-[var(--text-2)] font-light">Explore AI tools organized by what you need to accomplish.</p>
      </div>

      {CATEGORIES.map(cat => {
        const catTools = tools.filter(t => t.category === cat.name)
        const top = [...catTools].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 3)
        const rest = catTools.filter(t => !top.find(x => x.slug === t.slug))

        return (
          <div key={cat.name} className="mb-16">
            {/* Category header */}
            <div className="pl-5 border-l-[3px] mb-6" style={{ borderLeftColor: cat.accent }}>
              <div className="text-[10px] uppercase tracking-widest text-[var(--text-3)] font-bold mb-1.5">
                {cat.icon} {cat.name}
              </div>
              <h2 className="font-serif text-[28px] tracking-tight mb-1">{cat.name} AI Tools</h2>
              <p className="text-sm text-[var(--text-2)] font-light">{cat.desc} · {catTools.length} tools curated.</p>
            </div>

            {/* Top picks */}
            {top.length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] uppercase tracking-widest text-[var(--text-3)] font-bold mb-3">Top picks</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {top.map(t => (
                    <ToolCard key={t.slug}
                      tool={{ ...t, votes: getVotes(t.slug) }}
                      variant="m"
                      onVote={handleVote}
                      hasVoted={hasVoted(t.slug)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--text-3)] font-bold mb-3">
                  All {cat.name} tools
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                  {rest.map(t => (
                    <ToolCard key={t.slug}
                      tool={{ ...t, votes: getVotes(t.slug) }}
                      variant="s"
                      onVote={handleVote}
                      hasVoted={hasVoted(t.slug)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </main>
  )
}
