'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { PRACTICES, PROFILE } from '@/content'

/** Five plain links and one action. Practices live under Work. */
const NAV = [
  { label: 'Work', href: '/work' },
  { label: 'Writing', href: '/blog' },
  { label: 'Publications', href: '/publications' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
]

const SOCIALS = PROFILE.contact.filter((c) => ['LinkedIn', 'GitHub'].includes(c.label))

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const home = pathname === '/'

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/work'
      ? pathname.startsWith('/work') || PRACTICES.some((p) => pathname.startsWith(p.href))
      : pathname.startsWith(href)

  return (
    <>
      <header
        className={cn(
          'z-40 w-full',
          // On the homepage the giant pinned name is the wordmark, so the bar
          // floats over the first screen and scrolls away with it.
          home ? 'absolute inset-x-0 top-0' : 'sticky top-0 bg-paper',
        )}
      >
        <div className="mx-auto flex h-[76px] max-w-(--container-wide) items-center justify-between gap-8 px-s30">
          <Link
            href="/"
            className={cn(
              'font-head text-[1.625rem] font-bold leading-none tracking-[-0.01em] text-ink transition-opacity duration-150 hover:opacity-75',
              home && 'sr-only',
            )}
          >
            {PROFILE.name}
          </Link>

          <nav aria-label="Primary" className="ml-auto hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'relative py-2 font-body text-[1.0625rem] font-medium text-ink',
                  'after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-200',
                  'hover:after:scale-x-100',
                  isActive(item.href) && 'after:scale-x-100',
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact" className="btn min-h-[44px] px-5">
              <span>Contact</span>
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn btn-outline ml-auto min-h-[44px] px-5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span>Menu</span>
          </button>
        </div>
      </header>

      {open ? (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-sky px-s30 pb-8 text-ink lg:hidden"
        >
          <div className="flex h-[76px] shrink-0 items-center justify-between">
            <Link href="/" className="font-head text-[1.625rem] font-bold leading-none">
              {PROFILE.name}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn btn-outline min-h-[44px] px-5"
            >
              <span>Close</span>
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-8 flex flex-col gap-3">
            {[{ label: 'Home', href: '/' }, ...NAV, { label: 'Contact', href: '/contact' }].map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-head text-[3.25rem] font-bold leading-[0.95] tracking-[-0.02em]"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <p className="mt-10 font-body text-[1rem] font-medium">Practices</p>
          <ul className="mt-3 flex flex-col gap-2">
            {PRACTICES.map((p) => (
              <li key={p.key}>
                <Link href={p.href} className="font-body text-[1.125rem]">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex gap-6 pt-10">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="arrow-link"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}
