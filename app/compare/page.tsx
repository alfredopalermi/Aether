import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ComparePageClient } from './ComparePageClient'
import { ToastProvider } from '@/components/ui/Toast'
import { TOOLS } from '@/data/tools'
import { createServerClient } from '@/lib/supabase'

export const metadata = { title: 'Compare — Aether', description: 'Compare AI tools side by side.' }

async function getVotes(): Promise<Record<string, number>> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('votes').select('tool_slug, count')
    const map: Record<string, number> = {}
    data?.forEach(v => { map[v.tool_slug] = v.count })
    return map
  } catch { return {} }
}

export default async function ComparePage() {
  const votesMap = await getVotes()
  const tools = TOOLS.map(t => ({ ...t, votes: votesMap[t.slug] ?? 0 }))
  return (
    <ToastProvider>
      <Navbar tools={tools} />
      <ComparePageClient tools={tools} />
      <Footer />
    </ToastProvider>
  )
}
