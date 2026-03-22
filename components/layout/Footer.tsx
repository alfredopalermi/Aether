import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-16">
      <div className="max-w-[1160px] mx-auto px-6 py-8 flex items-center justify-between flex-wrap gap-4">
        <span className="font-serif text-lg">Aether</span>
        <div className="flex gap-5 flex-wrap">
          {[
            ['Directory', '/directory'],
            ['Categories', '/categories'],
            ["What's New", '/whats-new'],
            ['Compare', '/compare'],
            ['Submit', '/submit'],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="text-sm text-[var(--text-3)] hover:text-[var(--text)] transition-colors">
              {label}
            </Link>
          ))}
        </div>
        <span className="text-xs text-[var(--text-3)]">© 2025 Aether</span>
      </div>
    </footer>
  )
}
