import type { ContactLink, Practice, PracticeMeta, Profile, Stat } from './types'

export const PROFILE = {
  name: 'Romeo Tweneboah Koduah',
  title: 'Water, energy and climate systems — measured, modelled and turned into policy',
  location: 'Ghana',
  hero:
    'Environmental engineer and water data scientist working across the water–energy–food nexus, from continental discharge modelling to national regulation. The work runs from earth observation and machine learning through to policy instruments, stakeholder processes and the software that carries them.',
  bio: [
    'Romeo Tweneboah Koduah works at the intersection of water, energy and food systems, examining how climate change reshapes water availability, renewable energy generation and food security, and what that means for long-term sustainability. Machine learning and geospatial analysis are used to build predictive models that support water resource management, sustainable energy planning and clean energy transitions that reduce greenhouse gas emissions.',
    'The research operates at continental scale. Earth observation and remotely sensed data are used to assess water budgets alongside energy generation capacity, producing the evidence base for sound water–energy–food policy. That work spans MERIT-based VegET and mizuRoute baseline runs for Africa from 1992 to 2024 and future-scenario discharge to 2050, naturalised and reservoir-regulated discharge simulation for Mexico’s Lerma–Santiago Basin, water budget monitoring in the White Volta River Basin, and small hydropower assessment across Ghana’s western river systems.',
    'The evidence does not stop at the paper. The same practice carries findings into policy instruments — Ghana’s first zero-emission vehicle supply-side regulatory framework, an Article 6.2 cookstove carbon programme, national investment plans for solar-powered irrigation — and into the digital systems that make implementation measurable. Alongside this runs a sustained commitment to youth engagement, treating young people as active contributors to sustainable water, energy and climate solutions rather than an audience for them.',
  ],
  contact: [
    {
      label: 'Email',
      value: 'romeo.tweneboahkoduah@gmail.com',
      href: 'mailto:romeo.tweneboahkoduah@gmail.com',
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/ing-romeo-tweneboah-koduah',
      href: 'https://linkedin.com/in/ing-romeo-tweneboah-koduah',
    },
    {
      label: 'GitHub',
      value: 'github.com/romeokoduah',
      href: 'https://github.com/romeokoduah',
    },
    {
      label: 'Location',
      value: 'Ghana',
      href: 'https://www.openstreetmap.org/relation/192781',
    },
  ] as const satisfies readonly ContactLink[],
} as const satisfies Profile

/**
 * The five practices, in site order. Accents mirror the per-section colour
 * coding in the design spec.
 */
export const PRACTICES = [
  {
    key: 'research',
    label: 'Research & Hydrology',
    short: 'Research',
    href: '/research',
    accent: '#0b472c',
    blurb:
      'Continental and basin-scale hydrology built on earth observation, distributed modelling and machine learning — water budgets, discharge, environmental flows and hydropower potential.',
  },
  {
    key: 'consulting',
    label: 'Policy & Consulting',
    short: 'Consulting',
    href: '/consulting',
    accent: '#a4400a',
    blurb:
      'Turning technical evidence into instruments governments can adopt: regulation, carbon market design, investment plans and multi-partner research programmes.',
  },
  {
    key: 'systems',
    label: 'AI & Digital Systems',
    short: 'Systems',
    href: '/systems',
    accent: '#4458be',
    blurb:
      'Full-stack platforms built to close the implementation, measurement and coordination gaps that the policy and research work exposes.',
  },
  {
    key: 'communications',
    label: 'Communications & Knowledge Management',
    short: 'Communications',
    href: '/communications',
    accent: '#c14300',
    blurb:
      'Knowledge management for a World Bank Centre of Excellence, donor and institutional reporting, stakeholder convening and representation at national policy forums.',
  },
  {
    key: 'speaking',
    label: 'Training, Facilitation & Speaking',
    short: 'Speaking',
    href: '/speaking',
    accent: '#158753',
    blurb:
      'Certified facilitation on integrated water resources management, sub-regional webinar series, national youth climate convening, teaching and debate coaching.',
  },
] as const satisfies readonly PracticeMeta[]

/** Lookup helper for practice metadata by key. */
export const PRACTICE_BY_KEY: Readonly<Record<Practice, PracticeMeta>> =
  Object.fromEntries(PRACTICES.map((p) => [p.key, p])) as Record<
    Practice,
    PracticeMeta
  >

/**
 * Homepage stats strip. Every figure is drawn directly from the CV.
 *
 * - 43  — sub-Saharan African countries tracked by the NWA Tracker
 * - 7   — years of practice since the first RCEES appointment (Sep 2019)
 * - 4   — journal articles: 2 published, 2 under review
 * - 500 — registered young leaders convened at LCOY Ghana 2025
 */
export const STATS = [
  {
    value: 43,
    label: 'African countries tracked for national water accounting',
  },
  {
    value: 7,
    suffix: '+',
    label: 'Years across water, energy and climate practice',
  },
  {
    value: 4,
    label: 'Journal articles published or under review',
  },
  {
    value: 500,
    suffix: '+',
    label: 'Young leaders convened at LCOY Ghana 2025',
  },
] as const satisfies readonly Stat[]
