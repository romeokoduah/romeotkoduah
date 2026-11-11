'use client'

import { useEffect } from 'react'
import Link from 'next/link'

/**
 * Catches server errors in the dynamic sections — most plausibly the database
 * being briefly unreachable. The static pages are unaffected, so the recovery
 * advice is to try again or go back to the parts of the site that never fail.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surfaces in `pm2 logs romeotkoduah`.
    console.error('Unhandled error:', error)
  }, [error])

  return (
    <div className="bg-sky px-s30 py-s70 text-ink">
      <div className="mx-auto max-w-[56rem]">
        <h1 className="text-ink">This part of the site is not loading.</h1>
        <p className="mt-6 max-w-(--container-measure) font-body text-(length:--text-step-lead) leading-normal text-ink">
          Something went wrong. It is most likely temporary: try again in a moment —
          the rest of the site is unaffected.
        </p>
        {error.digest ? (
          <p className="mt-4 font-body text-[0.9375rem] text-muted">
            Reference: <code>{error.digest}</code>
          </p>
        ) : null}
        <div className="mt-9 flex flex-wrap gap-4">
          <button type="button" onClick={reset} className="btn">
            <span>Try again</span>
          </button>
          <Link href="/" className="btn btn-outline">
            <span>Back to the homepage</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
