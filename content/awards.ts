import type { Award } from './types'

export const AWARDS = [
  {
    id: 'global-impact-award-atox',
    year: '2026',
    title: 'Global Impact Award, AI Party ATOX Hackathon',
    detail: 'For Culturesphere, pitched at the hackathon.',
  },
  {
    id: 'tsinghua-global-youth-dialogue-delegate',
    year: '2026',
    title: 'Delegate, Fourth Tsinghua Global Youth Dialogue',
    org: 'Tsinghua University, China',
    detail: '120 delegates selected from 5,162 applicants.',
  },
  {
    id: 'open-africa-power-fellow',
    year: '2025',
    title: 'Open Africa Power Fellow',
    org: 'Sustainable Energy for All and Enel Foundation',
    detail:
      'Top ten performers of the cohort, with a fully funded residential module in Italy.',
  },
  {
    id: 'student-energy-fellow',
    year: '2022',
    title: 'Student Energy Fellow',
    org: 'Student Energy',
    detail: 'Selected to the global fellowship cohort.',
  },
  {
    id: 'sdg-innovation-challenge',
    year: '2020',
    title: 'Winner, SDG Innovation Challenge (Plastic4Education)',
    org: 'African Youth SDG Summit',
  },
  {
    id: 'ace-scholarship',
    year: '2020',
    title: 'World Bank Africa Centre of Excellence Scholarship',
    org: 'World Bank',
    detail: 'Awarded for graduate study.',
  },
  {
    id: 'osei-kusi-community-service',
    year: '2017',
    title: 'Fourth Place, Osei Kusi Foundation Community Service Awards',
    org: 'Osei Kusi Foundation',
    detail: 'Team A Need for Education.',
  },
] as const satisfies readonly Award[]
