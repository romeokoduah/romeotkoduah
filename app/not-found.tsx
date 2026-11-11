import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import type { Metadata } from 'next'
import { Btn, BtnRow, Section, Wide } from '@/components/site/primitives'

export const metadata: Metadata = {
  title: 'Page not found',
  description:
    'That page does not exist on romeotkoduah.org. Head back to the homepage or get in touch.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      <SiteHeader />
    <Section tone="sky" tall className="text-center">
      <Wide>
        <h1 data-rise className="mx-auto max-w-4xl text-ink">
          This page isn&rsquo;t here.
        </h1>
        <p
          data-rise
          style={{ '--i': 1 } as React.CSSProperties}
          className="mx-auto mt-6 max-w-(--container-measure) font-body text-(length:--text-step-lead) leading-normal text-ink"
        >
          Error 404. The link may be out of date, or the page may have moved — the
          work itself is all still on the site.
        </p>
        <BtnRow align="center" className="mt-9">
          <Btn href="/">Back to home</Btn>
          <Btn href="/contact" variant="outline">
            Get in touch
          </Btn>
        </BtnRow>
      </Wide>
    </Section>
      <SiteFooter />
    </>
  )
}
