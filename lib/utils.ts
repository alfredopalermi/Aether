import { type ClassValue, clsx } from 'clsx'
import { Tool, FilterState, CategoryMeta, Category } from './types'

// Simple className helper (no clsx dependency needed, but useful)
export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export const CATEGORIES: CategoryMeta[] = [
  { name: 'Writing',      icon: '✎', desc: 'Drafting, editing, and scaling content.',           accent: '#2563EB' },
  { name: 'Design',       icon: '◈', desc: 'Visual creation, image generation, brand tools.',   accent: '#9333EA' },
  { name: 'Video',        icon: '▷', desc: 'Video generation, editing, and voice production.',  accent: '#EA580C' },
  { name: 'Coding',       icon: '⌘', desc: 'AI pair programmers and code generation.',          accent: '#16A34A' },
  { name: 'Automation',   icon: '⚡', desc: 'Workflow automation and no-code integrations.',     accent: '#CA8A04' },
  { name: 'Marketing',    icon: '◎', desc: 'Campaigns, copywriting, and growth tools.',         accent: '#E11D48' },
  { name: 'Research',     icon: '◉', desc: 'Synthesis, citations, and literature tools.',       accent: '#0284C7' },
  { name: 'Productivity', icon: '□', desc: 'Notes, meetings, knowledge management.',            accent: '#475569' },
  { name: 'Sales',        icon: '◑', desc: 'Revenue intelligence, CRM AI, outbound.',           accent: '#059669' },
]

export function getCategoryMeta(name: Category): CategoryMeta {
  return CATEGORIES.find(c => c.name === name) ?? CATEGORIES[0]
}

export function filterTools(tools: Tool[], filters: Partial<FilterState>): Tool[] {
  let result = [...tools]

  if (filters.category && filters.category !== 'All') {
    result = result.filter(t => t.category === filters.category)
  }
  if (filters.pricing && filters.pricing !== 'All') {
    result = result.filter(t => t.pricing === filters.pricing)
  }
  if (filters.tag) {
    const tag = filters.tag.toLowerCase()
    result = result.filter(t =>
      t.tags.some(x => x.toLowerCase() === tag) ||
      t.use_cases.some(x => x.toLowerCase() === tag)
    )
  }
  if (filters.query) {
    const q = filters.query.toLowerCase()
    result = result.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.tags.some(x => x.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
    )
  }

  switch (filters.sort) {
    case 'newest':      result.sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime()); break
    case 'most-voted':  result.sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0)); break
    case 'featured':    result.sort((a, b) => Number(b.featured) - Number(a.featured)); break
    case 'a-z':         result.sort((a, b) => a.name.localeCompare(b.name)); break
  }

  return result
}

export function isNew(addedAt: string, days = 45): boolean {
  return Math.floor((Date.now() - new Date(addedAt).getTime()) / 86400000) <= days
}

export function getTOTWSlug(tools: Tool[]): string {
  const schedule = tools.filter(t => t.featured).map(t => t.slug)
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
  return schedule[week % schedule.length] ?? tools[0].slug
}

export function getWeekNumber(): number {
  return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % 52 || 52
}

// Export helpers
export function toolsToCSV(tools: Tool[]): string {
  const header = 'Name,Category,Pricing,Website,Tagline'
  const rows = tools.map(
    t => `"${t.name}","${t.category}","${t.pricing}","${t.website}","${t.tagline.replace(/"/g, '""')}"`
  )
  return [header, ...rows].join('\n')
}

export function toolsToMarkdown(tools: Tool[]): string {
  const lines = tools.map(
    t => `- **[${t.name}](${t.website})** (${t.category} · ${t.pricing}) — ${t.tagline}`
  )
  return `# My AI Tools from Aether\n\n${lines.join('\n')}`
}

export function toolsToText(tools: Tool[]): string {
  return tools.map(t => `${t.name} — ${t.website}`).join('\n')
}
