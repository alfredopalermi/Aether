/**
 * Seed script — run with: npm run seed
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from '@supabase/supabase-js'
import { TOOLS } from './tools'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  console.log(`Seeding ${TOOLS.length} tools…`)

  // Upsert tools
  const { error: toolsError } = await supabase
    .from('tools')
    .upsert(
      TOOLS.map(({ votes, ...t }) => t),
      { onConflict: 'slug' }
    )

  if (toolsError) { console.error('Tools error:', toolsError); process.exit(1) }
  console.log('✓ Tools seeded')

  // Upsert votes (initialise to 0)
  const { error: votesError } = await supabase
    .from('votes')
    .upsert(
      TOOLS.map(t => ({ tool_slug: t.slug, count: 0 })),
      { onConflict: 'tool_slug', ignoreDuplicates: true }
    )

  if (votesError) { console.error('Votes error:', votesError); process.exit(1) }
  console.log('✓ Votes initialised')
  console.log('Done.')
}

seed()
