'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useBookmarks } from '@/hooks/useBookmarks'
import { SearchModal } from '@/components/search/SearchModal'
import { Drawer } from './Drawer'
import type { Tool } from '@/lib/types'

interface NavbarProps { tools: Tool[] }

export function Navbar({ tools }: NavbarProps) {
  const pathname = usePathname()
  const { dark, toggle } = useTheme()
  const { bookmarks } = useBookmarks()
  const [searchOpen, setSearchOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const links = [
    { href: '/directory', label: 'Directory' },
    { href: '/categories', label: 'Categories' },
    { href: '/whats-new', label: "What's New" },
    { href: '/compare', label: 'Compare' },
  ]

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md"
           style={{ paddingTop: 'env(safe-area-inset-top,0px)' }}>
        <div className="max-w-[1160px] mx-auto px-6 flex items-center justify-between h-[60px] gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-serif text-xl tracking-tight shrink-0">
            <span className="w-[7px] h-[7px] rounded-full bg-[var(--text)] mt-0.5" />
            Aether
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-[var(--text-2)] flex-1">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                    className={`transition-colors hover:text-[var(--text)] ${pathname.startsWith(l.href) ? 'text-[var(--text)] font-medium' : ''}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-3)] text-sm transition-all hover:border-[var(--text-3)] min-w-[160px]">
              <span className="text-base">⌕</span>
              <span>Search tools…</span>
              <span className="ml-auto text-[10px] bg-[var(--bg-2)] border border-[var(--border)] rounded px-1">⌘K</span>
            </button>

            <button onClick={toggle}
                    className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--text-2)] transition-all hover:border-[var(--text-3)]">
              {dark ? '☀' : '☽'}
            </button>

            <Link href="/bookmarks"
                  className="btn-ghost relative">
              ♡ Saved
              {bookmarks.length > 0 && (
                <span className="ml-1 bg-[var(--text)] text-[var(--text-inv)] text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {bookmarks.length}
                </span>
              )}
            </Link>

            <Link href="/submit" className="btn-solid">+ Submit</Link>
          </div>

          {/* Mobile right */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setSearchOpen(true)}
                    className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-lg text-[var(--text-2)]">
              ⌕
            </button>
            <button onClick={toggle}
                    className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--text-2)]">
              {dark ? '☀' : '☽'}
            </button>
            <button onClick={() => setDrawerOpen(true)}
                    className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex flex-col items-center justify-center gap-[5px]">
              <span className="block w-[18px] h-[1.5px] bg-[var(--text)] rounded" />
              <span className="block w-[18px] h-[1.5px] bg-[var(--text)] rounded" />
              <span className="block w-[18px] h-[1.5px] bg-[var(--text)] rounded" />
            </button>
          </div>
        </div>
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} tools={tools} />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} bookmarkCount={bookmarks.length} />
    </>
  )
}
