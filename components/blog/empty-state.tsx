import { Btn, BtnRow } from '@/components/site/primitives'

/**
 * Nothing to show. An empty index should read as a deliberate state of the
 * site rather than a page that failed to load, so it gets a real headline, a
 * real sentence, and somewhere to go next.
 */
export function EmptyState({ tag }: { tag?: string }) {
  const filtered = Boolean(tag)

  return (
    <div className="bg-mist px-s20 py-s40 sm:px-s30">
      <h2 data-rise className="max-w-[24ch] font-head text-(length:--text-h2) leading-[0.95] text-ink">
        {filtered ? 'Nothing under that tag.' : 'The first piece is being written.'}
      </h2>

      <p
        data-rise
        style={{ '--i': 1 } as React.CSSProperties}
        className="mt-6 max-w-(--container-measure) font-body leading-[1.7] text-ink"
      >
        {filtered
          ? `Nothing carries the tag "${tag}" yet. Clear the filter to see everything that has been published.`
          : 'Notes on hydrology, climate policy and the digital systems built around them will appear here. Nothing has been published yet — the work is going on elsewhere in the meantime.'}
      </p>

      <BtnRow className="mt-9">
        {filtered ? (
          <Btn href="/blog">See everything</Btn>
        ) : (
          <Btn href="/systems">Browse the projects</Btn>
        )}
        <Btn href="/contact" variant="outline">
          Get in touch
        </Btn>
      </BtnRow>
    </div>
  )
}
