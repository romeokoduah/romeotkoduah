import type { ReactNode } from 'react'
import { Wide } from './primitives'
import { Reveal } from './reveal'

/**
 * Standard interior-page header: soft paper band, accent eyebrow, oversized
 * Oswald title at line-height 1, lede constrained to the 740px text measure.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  accent,
  children,
}: {
  eyebrow: string
  title: string
  lede?: string
  accent: string
  children?: ReactNode
}) {
  return (
    <div className="border-b-2 bg-soft py-s50" style={{ borderColor: accent }}>
      <Wide>
        <Reveal immediate>
          <p
            className="font-body text-xs font-bold uppercase tracking-[0.18em]"
            style={{ color: accent }}
          >
            {eyebrow}
          </p>
        </Reveal>
        <Reveal immediate delay={0.06}>
          <h1 className="mt-4 max-w-4xl" style={{ color: accent }}>
            {title}
          </h1>
        </Reveal>
        {lede ? (
          <Reveal immediate delay={0.12}>
            <p className="mt-6 max-w-(--container-measure) font-body text-(length:--text-fluid-md) leading-normal text-ink/80">
              {lede}
            </p>
          </Reveal>
        ) : null}
        {children ? <Reveal immediate delay={0.18}>{children}</Reveal> : null}
      </Wide>
    </div>
  )
}
