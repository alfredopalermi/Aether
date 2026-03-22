'use client'
import Link from 'next/link'
import { useEffect } from 'react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  bookmarkCount: number
}

const NAV_ITEMS = [
  { href: '/',           icon: '◎', label: 'Home' },
  { href: '/directory',  icon: '◈', label: 'Directory' },
  { href: '/categories', icon: '□', label: 'Categories' },
  { href: '/whats-new',  icon: '✦', label: "What's New" },
  { href: '/compare',    icon: '⊕', label: 'Compare' },
  { href: '/bookmarks',  icon: '♡', label: 'Saved' },
]

export function Drawer({ open, onClose, bookmarkCount }: DrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose}
           className={`fixed inset-0 z-50 bg-black/50 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-[min(320px,85vw)] bg-[var(--surface)] border-l border-[var(--border)] flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
           style={{ paddingTop: 'env(safe-area-inset-top,0px)' }}>
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[var(--border)]">
          <span className="font-serif text-lg">Aether</span>
          <button onClick={onClose}
                  className="w-8 h-8 rounded-md border border-[var(--border)] flex items-center justify-center text-lg text-[var(--text-2)]">×</button>
        </div>

        <nav className="flex-1 py-3">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} onClick={onClose}
                  className="flex items-center gap-3 px-5 py-3 text-[15px] text-[var(--text-2)] border-b border-[var(--border-soft)] hover:bg-[var(--accent-soft)] hover:text-[var(--text)] transition-colors">
              <span className="text-lg w-6 text-center">{item.icon}</span>
              {item.label}
              {item.href === '/bookmarks' && bookmarkCount > 0 && (
                <span className="ml-1.5 bg-[var(--text)] text-[var(--text-inv)] text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {bookmarkCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-5 border-t border-[var(--border)] flex flex-col gap-2.5"
             style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,0px))' }}>
          <Link href="/submit" onClick={onClose} className="btn-solid justify-center">+ Submit a Tool</Link>
        </div>
      </div>
    </>
  )
}
