import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { TOOLS } from '@/data/tools'

export const revalidate = 60 // revalidate every 60s

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const pricing  = searchParams.get('pricing')
  const sort     = searchParams.get('sort') ?? 'newest'
  const q        = searchParams.get('q')
  const tag      = searchParams.get('tag')

  try {
    const supabase = createServerClient()

    // Fetch votes from Supabase
    const { data: votesData } = await supabase.from('votes').select('tool_slug, count')
    const votesMap: Record<string, number> = {}
    votesData?.forEach(v => { votesMap[v.tool_slug] = v.count })

    // Merge votes into tools
    let tools = TOOLS.map(t => ({ ...t, votes: votesMap[t.slug] ?? 0 }))

    // Filter
    if (category && category !== 'All') tools = tools.filter(t => t.category === category)
    if (pricing && pricing !== 'All')   tools = tools.filter(t => t.pricing === pricing)
    if (tag) {
      const tagLc = tag.toLowerCase()
      tools = tools.filter(t =>
        t.tags.some(x => x.toLowerCase() === tagLc) ||
        t.use_cases.some(x => x.toLowerCase() === tagLc)
      )
    }
    if (q) {
      const ql = q.toLowerCase()
      tools = tools.filter(t =>
        t.name.toLowerCase().includes(ql) ||
        t.tagline.toLowerCase().includes(ql) ||
        t.tags.some(x => x.toLowerCase().includes(ql)) ||
        t.category.toLowerCase().includes(ql)
      )
    }

    // Sort
    if (sort === 'newest')     tools.sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime())
    if (sort === 'most-voted') tools.sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
    if (sort === 'featured')   tools.sort((a, b) => Number(b.featured) - Number(a.featured))
    if (sort === 'a-z')        tools.sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({ tools, total: tools.length })
  } catch {
    // Fallback to local data if Supabase is unavailable
    return NextResponse.json({ tools: TOOLS, total: TOOLS.length })
  }
}
