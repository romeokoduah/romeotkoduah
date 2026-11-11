import Link from 'next/link'
import { PROFILE } from '@/content'
import { HomeCredits } from './home-credits'

const YEAR = new Date().getFullYear()

const LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Writing', href: '/blog' },
  { label: 'Publications', href: '/publications' },
  { label: 'Contact', href: '/contact' },
]

const ELSEWHERE = PROFILE.contact.filter((c) => ['LinkedIn', 'GitHub'].includes(c.label))

/**
 * A designed close rather than a sitemap: the name returns at full width on
 * a navy field, then one quiet line.
 */
export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-(--container-wide) px-s30 pt-s50 pb-8">
        <Link
          href="/"
          className="block font-head font-bold uppercase leading-[0.82] tracking-[-0.02em] text-sky transition-colors duration-200 hover:text-paper"
          style={{ fontSize: 'clamp(2.5rem, 0.6rem + 9.6vw, 11rem)' }}
        >
          Romeo Tweneboah Koduah
        </Link>

        <div className="mt-s40 grid gap-4 font-body text-[1rem] sm:grid-cols-[1fr_auto_1fr] sm:items-baseline">
          <p className="text-paper/80">Water, energy and climate. Ghana.</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="arrow-link text-paper">
                {l.label}
              </Link>
            ))}
            {ELSEWHERE.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="arrow-link text-paper"
              >
                {c.label}
              </a>
            ))}
          </nav>
          <p className="text-paper/80 sm:text-right">© {YEAR}</p>
        </div>
        <HomeCredits />
      </div>
    </footer>
  )
}
