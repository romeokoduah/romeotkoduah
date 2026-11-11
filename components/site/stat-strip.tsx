'use client'

import { NumberTicker } from '@/components/ui/number-ticker'
import type { Stat } from '@/content/types'

export function StatStrip({ stats }: { stats: readonly Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} data-rise>
          <dt className="sr-only">{s.label}</dt>
          <dd>
            <span className="flex items-baseline font-head text-(length:--text-step-head) leading-none text-ink tabular-nums">
              <NumberTicker value={s.value} className="font-head text-ink" />
              {s.suffix ? <span aria-hidden>{s.suffix}</span> : null}
            </span>
            <span className="mt-3 block font-body leading-snug text-muted">
              {s.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
