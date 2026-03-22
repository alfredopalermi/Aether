export type Pricing = 'Free' | 'Freemium' | 'Paid'
export type Category =
  | 'Writing'
  | 'Design'
  | 'Video'
  | 'Coding'
  | 'Automation'
  | 'Marketing'
  | 'Research'
  | 'Productivity'
  | 'Sales'

export interface Tool {
  id: number
  name: string
  slug: string
  tagline: string
  description: string
  category: Category
  pricing: Pricing
  featured: boolean
  website: string
  logo: string
  use_cases: string[]
  pros: string[]
  cons: string[]
  tags: string[]
  added_at: string
  editorial?: string
  votes?: number
}

export interface CategoryMeta {
  name: Category
  icon: string
  desc: string
  accent: string
}

export interface VoteRow {
  tool_slug: string
  count: number
}

export type SortOption = 'newest' | 'most-voted' | 'featured' | 'a-z'
export type ViewMode = 'grid' | 'list'

export interface FilterState {
  category: Category | 'All'
  pricing: Pricing | 'All'
  sort: SortOption
  tag: string | null
  query: string
}
