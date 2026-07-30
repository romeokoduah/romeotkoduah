import Link from 'next/link'
import { PRACTICES, PROFILE } from '@/content'

const YEAR = 2026

const EMAIL = PROFILE.contact.find((c) => c.label === 'Email')!
const ELSEWHERE = PROFILE.contact.filter((c) =>
  ['LinkedIn', 'GitHub'].includes(c.label),
)

export function SiteFooter() {
  return (
    <footer className="bg-ink px-s30 py-s50 text-soft">
      <div className="mx-auto max-w-(--container-wide)">
        <div className="grid gap-s30 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* identity */}
          <div>
            <p className="font-head text-3xl leading-none">{PROFILE.name}</p>
            <p className="mt-3 max-w-sm font-body text-sm text-soft/70">
              {PROFILE.title}
            </p>
            <a
              href={EMAIL.href}
              className="mt-6 inline-block font-body text-sm font-bold underline underline-offset-4 transition-colors duration-150 hover:text-ember"
            >
              {EMAIL.value}
            </a>
          </div>

          {/* practices */}
          <nav aria-label="Practices">
            <p className="font-head text-lg tracking-wide text-soft/50">Practice</p>
            <ul className="mt-4 space-y-2">
              {PRACTICES.map((p) => (
                <li key={p.key}>
                  <Link
                    href={p.href}
                    className="font-body text-sm transition-colors duration-150 hover:text-ember"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* elsewhere */}
          <nav aria-label="More">
            <p className="font-head text-lg tracking-wide text-soft/50">More</p>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'About', href: '/about' },
                { label: 'Publications', href: '/publications' },
                { label: 'Contact', href: '/contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-body text-sm transition-colors duration-150 hover:text-ember"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              {ELSEWHERE.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm transition-colors duration-150 hover:text-ember"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-s40 flex flex-col gap-2 border-t border-soft/15 pt-6 font-body text-xs text-soft/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} {PROFILE.name}</p>
          <p>{PROFILE.location}</p>
        </div>
      </div>
    </footer>
  )
}
