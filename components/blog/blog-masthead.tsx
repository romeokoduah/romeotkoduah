import { Wide } from '@/components/site/primitives'
import { NumberTicker } from '@/components/ui/number-ticker'

/**
 * The Writing masthead. The same sky field as every interior page, and the
 * one page on the site that is a growing body of work rather than a fixed
 * record, so beside the lede it counts the archive up from zero.
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
    <section className="bg-sky pb-s50 pt-s40">
      <Wide>
        {/* Full width so the title holds to two lines. */}
        <h1 data-rise className="max-w-[28ch] text-ink">
          Reports, field notes and arguments from the work.
        </h1>

        <div className="mt-8 grid gap-x-s40 gap-y-s30 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-end">
          <p
            data-rise
            style={{ '--i': 1 } as React.CSSProperties}
            className="max-w-(--container-measure) font-body text-(length:--text-step-lead) leading-[1.4] text-ink"
          >
            Accounts of trainings, projects and policy processes on water, energy and
            climate, written out in full rather than compressed into a slide.
          </p>

          <dl
            data-rise
            style={{ '--i': 2 } as React.CSSProperties}
            className="grid grid-cols-3 gap-6"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-2 mt-2 font-body text-[0.9375rem] font-medium leading-snug text-ink">
                  {s.label}
                </dt>
                <dd className="order-1 font-head text-[clamp(2.25rem,1.6rem+2vw,3.5rem)] leading-none text-ink tabular-nums">
                  {s.value > 0 ? (
                    <NumberTicker value={s.value} className="font-head text-ink" />
                  ) : (
                    '0'
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Wide>
    </section>
  )
}
