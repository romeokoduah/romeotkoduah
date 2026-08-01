'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { PRACTICES, PROFILE } from '@/content'
import { SOCIAL_ICONS } from './icons'

const NAV = [
  { label: 'About', href: '/about' },
  ...PRACTICES.map((p) => ({ label: p.short, href: p.href })),
  { label: 'Writing', href: '/blog' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

/** Short masthead strapline — PROFILE.title is the long-form version. */
const STRAPLINE = 'Water · Energy · Climate — research, policy and systems'

const SOCIALS = PROFILE.contact.filter((c) =>
  ['Email', 'LinkedIn', 'GitHub'].includes(c.label),
)

export function SiteHeader() {
  const pathname = usePathname()
  const [condensed, setCondensed] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 220)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close the overlay on navigation and lock scroll while it is open
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      {/* ---- full masthead: centred, stacked, forest band ---- */}
      <header className="bg-forest px-s30 py-s20 text-white">
        <div className="mx-auto flex max-w-(--container-wide) flex-col items-center gap-2 text-center">
          <Link href="/" className="group flex flex-col items-center gap-0.5">
            <span className="font-head text-(length:--text-brand) font-medium leading-none tracking-normal">
              Romeo Tweneboah Koduah
            </span>
            <span className="font-body text-[13px] font-semibold text-periwinkle/90 sm:text-sm">
              {STRAPLINE}
            </span>
          </Link>

          {/* desktop nav */}
          <nav
            aria-label="Primary"
            className="mt-2 hidden flex-wrap items-center justify-center gap-x-5 gap-y-1 lg:flex xl:gap-x-7"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'font-body text-(length:--text-fluid-sm) font-semibold leading-[2] transition-colors duration-150 hover:text-periwinkle',
                  isActive(item.href) && 'text-periwinkle underline underline-offset-[6px]',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* socials */}
          <div className="mt-2 hidden items-center gap-6 lg:flex">
            {SOCIALS.map((s) => {
              const Icon = SOCIAL_ICONS[s.label]
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  title={s.label}
                  className="text-white/75 transition-colors duration-150 hover:text-white"
                >
                  {Icon ? <Icon className="h-6 w-6" /> : null}
                  <span className="sr-only">{s.label}</span>
                </a>
              )
            })}
          </div>

          {/* mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-2 border-2 border-white px-4 py-2 font-body text-sm font-bold lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            Menu
          </button>
        </div>
      </header>

      {/* ---- condensed sticky bar ---- */}
      <AnimatePresence>
        {condensed && (
          <motion.div
            initial={reduce ? false : { y: -64 }}
            animate={{ y: 0 }}
            exit={reduce ? undefined : { y: -64 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-x-0 top-0 z-50 hidden bg-forest/97 backdrop-blur lg:block"
          >
            <div className="mx-auto flex h-16 max-w-(--container-wide) items-center justify-between px-s30">
              <Link
                href="/"
                className="font-head text-xl font-medium leading-none text-white"
              >
                Romeo T. Koduah
              </Link>
              <nav aria-label="Primary, condensed" className="flex items-center gap-5">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'font-body text-sm font-semibold text-white transition-colors duration-150 hover:text-periwinkle',
                      isActive(item.href) && 'text-periwinkle',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- mobile overlay ---- */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex flex-col bg-indigo px-s30 py-s20 text-soft lg:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-head text-xl">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border-2 border-soft px-4 py-2 font-body text-sm font-bold"
              >
                Close
              </button>
            </div>
            <nav
              aria-label="Mobile"
              className="mt-10 flex flex-1 flex-col gap-5 overflow-y-auto"
            >
              <Link href="/" className="font-head text-4xl leading-none">
                Home
              </Link>
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'font-head text-4xl leading-none',
                    isActive(item.href) && 'text-periwinkle',
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/publications" className="font-head text-4xl leading-none">
                Publications
              </Link>
            </nav>
            <div className="flex flex-wrap items-center gap-7 pt-8">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.label]
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    title={s.label}
                    className="text-soft/85 transition-colors duration-150 hover:text-soft"
                  >
                    {Icon ? <Icon className="h-7 w-7" /> : null}
                    <span className="sr-only">{s.label}</span>
                  </a>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
