import { Wide } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { DotPattern } from '@/components/ui/dot-pattern'
import { NumberTicker } from '@/components/ui/number-ticker'
import { TextAnimate } from '@/components/ui/text-animate'
import { cn } from '@/lib/utils'

/**
 * The Writing masthead. Same soft band and indigo rule as every interior
 * page, but the title sets itself line by line and the right-hand column
 * counts the archive up from zero — the one page on the site that is a
 * growing body of work rather than a fixed record, so it says how big it is.
 *
 * The counts describe the whole archive, not the current tag filter: the
 * masthead is about the collection, the list below is about the selection.
 */
export function BlogMasthead({
  pieces,
  topics,
  minutes,
}: {
  pieces: number
  topics: number
  minutes: number
}) {
  const stats = [
    { value: pieces, label: pieces === 1 ? 'piece published' : 'pieces published' },
    { value: topics, label: topics === 1 ? 'topic' : 'topics' },
    { value: minutes, label: 'minutes of reading' },
  ]

  return (
    <section className="relative overflow-hidden border-b-2 border-indigo bg-soft py-s50">
      <DotPattern
        width={22}
        height={22}
        cr={1}
        className={cn(
          'fill-indigo/20',
          '[mask-image:radial-gradient(560px_circle_at_85%_30%,white,transparent)]',
        )}
      />

      <Wide className="relative">
        <div className="grid gap-x-s40 gap-y-s30 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <Reveal immediate>
              <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-indigo">
                Writing
              </p>
            </Reveal>

            <TextAnimate
              as="h1"
              by="line"
              animation="blurInUp"
              duration={0.7}
              once
              className="mt-4 text-indigo"
            >
              {'Reports, field notes\nand arguments\nfrom the work.'}
            </TextAnimate>

            <Reveal immediate delay={0.25}>
              <p className="mt-6 max-w-(--container-measure) font-body text-(length:--text-fluid-md) leading-normal text-ink/80">
                Accounts of trainings, projects and policy processes on water, energy and
                climate, written out in full rather than compressed into a slide.
              </p>
            </Reveal>
          </div>

          <Reveal immediate delay={0.35}>
            <dl className="grid grid-cols-3 border-t-2 border-indigo/30 lg:grid-cols-1">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col border-indigo/15 py-4 pr-3 lg:flex-row lg:items-baseline lg:justify-between lg:gap-4 lg:border-b-2 lg:pr-0 lg:last:border-b-0"
                >
                  <dt className="order-2 mt-2 font-body text-[13px] font-semibold leading-snug text-ink/65 lg:mt-0 lg:text-right">
                    {s.label}
                  </dt>
                  <dd className="order-1 font-head text-(length:--text-fluid-lg) leading-none text-indigo tabular-nums">
                    {s.value > 0 ? (
                      <NumberTicker value={s.value} className="font-head text-indigo" />
                    ) : (
                      '0'
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Wide>
    </section>
  )
}
