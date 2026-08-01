import { Btn, BtnRow } from '@/components/site/primitives'
import { ACCENT_HEX } from './shared'

/**
 * Nothing to show. An empty index should read as a deliberate state of the
 * site rather than a page that failed to load, so it gets a real headline, a
 * real sentence, and somewhere to go next.
 */
export function EmptyState({ tag }: { tag?: string }) {
  const filtered = Boolean(tag)

  return (
    <div className="border-2 border-indigo/25 bg-soft px-s20 py-s40 sm:px-s30">
      <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-indigo">
        {filtered ? 'No matches' : 'Nothing published yet'}
      </p>

      <h2 className="mt-5 max-w-[18ch] font-head text-(length:--text-h2) leading-[1] text-indigo">
        {filtered ? 'Nothing under that tag.' : 'The first piece is being written.'}
      </h2>

      <p className="mt-6 max-w-(--container-measure) font-body text-(length:--text-fluid-sm) leading-[1.75] text-ink/75">
        {filtered
          ? `Nothing carries the tag "${tag}" yet. Clear the filter to see everything that has been published.`
          : 'Notes on hydrology, climate policy and the digital systems built around them will appear here. Nothing has been published yet — the work is going on elsewhere in the meantime.'}
      </p>

      <BtnRow className="mt-9">
        {filtered ? (
          <Btn href="/blog" accent={ACCENT_HEX}>
            See everything
          </Btn>
        ) : (
          <Btn href="/systems" accent={ACCENT_HEX}>
            Browse the projects
          </Btn>
        )}
        <Btn href="/contact" variant="outline" accent="var(--color-forest)">
          Get in touch
        </Btn>
      </BtnRow>
    </div>
  )
}
