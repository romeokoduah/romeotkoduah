import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { ScrollProgress } from '@/components/ui/scroll-progress'

/**
 * Chrome for the public site. The admin dashboard sits outside this group and
 * brings its own, so it is not buried under the full masthead.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-forest focus:px-4 focus:py-2 focus:font-body focus:font-bold focus:text-soft"
      >
        Skip to content
      </a>
      <ScrollProgress className="h-[2px] bg-none bg-rust" />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  )
}
