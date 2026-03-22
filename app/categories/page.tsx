import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CompareBar } from '@/components/compare/CompareBar'
import { CategoriesClient } from './CategoriesClient'
import { ToastProvider } from '@/components/ui/Toast'
import { TOOLS } from '@/data/tools'
import { createServerClient } from '@/lib/supabase'

export const revalidate = 60
export const metadata = { title: 'Categories — Aether', description: 'Browse AI tools by category.' }

async function getVotes(): Promise<Record<string, number>> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('votes').select('tool_slug, count')
    const map: Record<string, number> = {}
    data?.forEach(v => { map[v.tool_slug] = v.count })
    return map
  } catch { return {} }
}

export default async function CategoriesPage() {
  const votesMap = await getVotes()
  const tools = TOOLS.map(t => ({ ...t, votes: votesMap[t.slug] ?? 0 }))
  return (
    <ToastProvider>
      <Navbar tools={tools} />
      <CategoriesClient tools={tools} />
      <Footer />
      <CompareBar tools={tools} />
    </ToastProvider>
  )
}
