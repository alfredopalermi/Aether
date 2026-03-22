import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client (singleton)
export const supabase = createClient(url, anon)

// Server client (for API routes / Server Components)
export function createServerClient() {
  return createClient(url, anon, {
    auth: { persistSession: false },
  })
}
