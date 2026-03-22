import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/votes — returns all vote counts
export async function GET() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from('votes').select('tool_slug, count')
    if (error) throw error
    const map: Record<string, number> = {}
    data.forEach(v => { map[v.tool_slug] = v.count })
    return NextResponse.json(map)
  } catch {
    return NextResponse.json({})
  }
}

// POST /api/votes — { slug, action: 'increment' | 'decrement' }
export async function POST(req: NextRequest) {
  try {
    const { slug, action } = await req.json()
    if (!slug || !['increment', 'decrement'].includes(action)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const supabase = createServerClient()
    const fn = action === 'increment' ? 'increment_vote' : 'decrement_vote'
    const { data, error } = await supabase.rpc(fn, { p_slug: slug })
    if (error) throw error

    return NextResponse.json({ count: data ?? 0 })
  } catch (e) {
    return NextResponse.json({ error: 'Vote failed' }, { status: 500 })
  }
}
