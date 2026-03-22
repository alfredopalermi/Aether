# Aether — AI Tools Directory

A curated, production-ready AI tools directory built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Stack

- **Next.js 14** — App Router, SSG, Server Components
- **TypeScript** — full type safety
- **Tailwind CSS** — utility-first styling with dark mode
- **Supabase** — Postgres database for tools and real-time votes
- **Vercel** — zero-config deployment

## Features

- 24 curated AI tools across 9 categories
- Real-time voting (Supabase)
- Bookmarks, compare, personal notes (localStorage)
- Dark mode with system preference detection
- Live search modal with recent searches
- Tool of the Week (auto-rotates weekly)
- Personalised "For You" section
- List and grid view in directory
- Prev/Next navigation on tool detail pages
- Export saved tools (CSV, Markdown, Text, Clipboard)
- Fully responsive — mobile drawer, fullscreen search, stacked compare
- SEO-ready with `generateMetadata` and `generateStaticParams`

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/aether.git
cd aether
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. In the SQL Editor, paste and run the contents of `supabase/migrations/001_initial.sql`
3. Go to Settings → API and copy your project URL and anon key

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Seed the database

```bash
npm run seed
```

This populates the `tools` and `votes` tables with all 24 tools.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project → select your repo
3. Add environment variables in Vercel dashboard (same as `.env.local`)
4. Deploy — zero configuration needed

---

## Project Structure

```
aether/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, theme script)
│   ├── page.tsx            # Home (server) + HomeClient (interactive)
│   ├── directory/          # All tools page
│   ├── tool/[slug]/        # Tool detail page (SSG)
│   ├── categories/         # Editorial categories page
│   ├── whats-new/          # Changelog feed
│   ├── compare/            # Side-by-side tool comparison
│   ├── bookmarks/          # Saved tools + export
│   ├── submit/             # Submit a tool form
│   └── api/
│       ├── tools/          # GET tools with vote counts
│       └── votes/          # GET + POST votes (Supabase RPC)
├── components/
│   ├── layout/             # Navbar, Footer, Drawer
│   ├── tools/              # ToolCard (S/M/L), ToolListItem
│   ├── compare/            # CompareBar (desktop + mobile pill)
│   ├── search/             # SearchModal with recent searches
│   └── ui/                 # Toast provider
├── hooks/                  # useBookmarks, useCompare, useNotes,
│                           # useVotes, useVisited, useTheme
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── supabase.ts         # Supabase client (browser + server)
│   └── utils.ts            # filterTools, CATEGORIES, export helpers
├── data/
│   ├── tools.ts            # 24 tool definitions
│   └── seed.ts             # Supabase seed script
└── supabase/
    └── migrations/
        └── 001_initial.sql # Schema + RLS + vote functions
```

## Adding a New Tool

1. Add an entry to `data/tools.ts` following the existing pattern
2. Run `npm run seed` to push to Supabase
3. The page will automatically revalidate every 60 seconds on Vercel

## Customisation

- **Brand name**: search for "Aether" across the project
- **Colors**: edit CSS variables in `app/globals.css`
- **Categories**: update `CATEGORIES` array in `lib/utils.ts`
- **Tool of the Week schedule**: edit `TOTW_SCHEDULE` in `app/HomeClient.tsx`
