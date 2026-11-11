import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { Rise } from '@/components/site/rise'

/**
 * Chrome for the public site. The admin dashboard sits outside this group and
 * brings its own, so it is not buried under the full masthead.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-3 focus:font-body focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <Rise />
    </>
  )
}
