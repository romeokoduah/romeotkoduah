import type { Metadata, Viewport } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-barlow',
  display: 'swap',
})

const SITE_URL = 'https://romeotkoduah.org'
const DESCRIPTION =
  'Romeo Tweneboah Koduah — water, energy and climate systems: hydrological research, climate policy and consulting, AI and digital systems, communications, and training across Ghana and West Africa.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Romeo Tweneboah Koduah — Water, Energy & Climate Systems',
    template: '%s — Romeo Tweneboah Koduah',
  },
  description: DESCRIPTION,
  keywords: [
    'Romeo Tweneboah Koduah',
    'hydrology',
    'water resources',
    'environmental engineering',
    'climate policy',
    'water–energy–food nexus',
    'earth observation',
    'remote sensing',
    'renewable energy',
    'Ghana',
    'IWMI',
    'UNEP',
  ],
  authors: [{ name: 'Romeo Tweneboah Koduah', url: SITE_URL }],
  creator: 'Romeo Tweneboah Koduah',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: 'Romeo Tweneboah Koduah',
    title: 'Romeo Tweneboah Koduah — Water, Energy & Climate Systems',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Romeo Tweneboah Koduah — Water, Energy & Climate Systems',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#6bb4ee',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${barlow.variable}`}>
      <head>
        {/* Belt and braces for the scroll reveals: `@media (scripting: none)`
            covers script-disabled browsers, this covers older ones that lack
            that query. Both target only `.reveal`, so nothing else is forced. */}
        <noscript>
          <style>{`[data-rise],.reveal{opacity:1!important;filter:none!important;transform:none!important}`}</style>
        </noscript>
      </head>
      {/* The public masthead and footer live in app/(site)/layout.tsx, not
          here, so the admin dashboard is not wrapped in site chrome. */}
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  )
}
