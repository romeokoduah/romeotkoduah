import type { Metadata } from 'next'
import { Btn, BtnRow, Eyebrow, Section, Wide } from '@/components/site/primitives'

export const metadata: Metadata = {
  title: 'Page not found',
  description:
    'That page does not exist on romeotkoduah.org. Head back to the homepage or get in touch.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <Section tone="forest" tall className="text-center">
      <Wide>
        <Eyebrow className="text-soft">404</Eyebrow>
        <h1 className="mx-auto mt-5 max-w-3xl text-soft">
          This page isn&rsquo;t here.
        </h1>
        <p className="mx-auto mt-6 max-w-(--container-measure) font-body text-(length:--text-fluid-md) leading-normal text-soft/80">
          The link may be out of date, or the page may have moved — the work
          itself is all still on the site.
        </p>
        <BtnRow align="center" className="mt-9">
          <Btn href="/">Back to home</Btn>
          <Btn href="/contact" variant="outline" accent="var(--color-soft)">
            Get in touch
          </Btn>
        </BtnRow>
      </Wide>
    </Section>
  )
}
