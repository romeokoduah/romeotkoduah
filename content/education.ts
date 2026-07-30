import type { EducationEntry } from './types'

export const EDUCATION = [
  {
    id: 'msc-international-relations',
    degree: 'MSc, International Relations',
    institution: 'University of Gold Coast',
    location: 'Accra, Ghana',
    period: 'Jul 2025 – Jul 2026',
    thesis:
      'Climate Diplomats in the City: How Kayayei Negotiate Human Security and Urban Sovereignty in Accra’s Informal Market.',
  },
  {
    id: 'msc-environmental-engineering-and-management',
    degree: 'MSc, Environmental Engineering and Management',
    institution: 'University of Energy and Natural Resources (UENR)',
    location: 'Sunyani, Ghana',
    period: 'Completed Dec 2022',
    award: 'World Bank Africa Centre of Excellence Scholarship',
    thesis:
      'Using Earth Observation to Monitor Water Budgets for River Basin Management — White Volta River Basin.',
  },
  {
    id: 'bsc-environmental-engineering',
    degree: 'BSc, Environmental Engineering',
    institution: 'University of Energy and Natural Resources (UENR)',
    location: 'Sunyani, Ghana',
    period: 'Completed Aug 2019',
    thesis:
      'Assessment and Treatment of Arsenic in Water Using Laterite — Bibiani, Ghana.',
  },
] as const satisfies readonly EducationEntry[]
