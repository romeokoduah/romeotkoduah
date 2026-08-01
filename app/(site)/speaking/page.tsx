import type { Metadata } from 'next'
import { PRACTICE_BY_KEY } from '@/content'
import { PracticePage } from '@/components/site/practice-page'

const PRACTICE = PRACTICE_BY_KEY.speaking

export const metadata: Metadata = {
  title: PRACTICE.label,
  description: PRACTICE.blurb,
  alternates: { canonical: PRACTICE.href },
  openGraph: {
    type: 'website',
    url: PRACTICE.href,
    title: `${PRACTICE.label} — Romeo Tweneboah Koduah`,
    description: PRACTICE.blurb,
  },
}

export default function SpeakingPage() {
  return <PracticePage practice="speaking" />
}
