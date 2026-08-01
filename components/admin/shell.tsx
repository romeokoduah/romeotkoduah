'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/app/admin/actions'

interface NavItem {
  label: string
  href: string
  exact?: boolean
  badge?: boolean
}

const NAV: NavItem[] = [
  { label: 'Overview', href: '/admin', exact: true },
  { label: 'Posts', href: '/admin/posts' },
  { label: 'Comments', href: '/admin/comments', badge: true },
  { label: 'Gallery', href: '/admin/gallery' },
  { label: 'Settings', href: '/admin/settings' },
]

/**
 * The dashboard chrome: one dense bar, then the working area. Deliberately
 * darker and tighter than the public site so there is never any doubt about
 * which side of the login you are on.
 */
export function AdminShell({
  pending,
  children,
}: {
  pending: number
  children: ReactNode
}) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className="min-h-screen bg-soft">
      <div className="border-b-2 border-ink bg-ink text-soft">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-3 px-s30 py-3">
          <span className="font-head text-sm font-medium uppercase tracking-[0.2em] text-soft/70">
            Dashboard
          </span>

          <nav aria-label="Dashboard sections" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {NAV.map((item) => {
              const active = isActive(item.href, item.exact)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'inline-flex items-center gap-2 border-b-2 pb-0.5 font-body text-xs font-bold uppercase tracking-[0.12em] transition-colors',
                    active
                      ? 'border-rust text-soft'
                      : 'border-transparent text-soft/60 hover:text-soft',
                  )}
                >
                  {item.label}
                  {item.badge && pending > 0 && (
                    <span className="inline-flex min-w-[20px] items-center justify-center bg-rust px-1.5 py-0.5 font-head text-[11px] font-medium leading-none tabular-nums text-white">
                      {pending}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/"
              className="font-body text-xs font-semibold text-soft/60 underline underline-offset-4 transition-colors hover:text-soft"
            >
              View site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="cursor-pointer border-2 border-soft/30 bg-transparent px-3 py-1.5 font-body text-[11px] font-bold uppercase tracking-[0.1em] leading-none text-soft transition-colors hover:border-soft hover:bg-soft hover:text-ink"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-s30 py-8">{children}</div>
    </div>
  )
}
