import type { SpeakingEntry, SpeakingKind } from './types'

/**
 * Teaching, facilitation, capacity building and convening — the CV record in
 * flat form. The `speaking` practice projects in `projects.ts` cover the same
 * ground at programme level; this list is the itemised version.
 */
export const SPEAKING = [
  {
    id: 'sdg-651-certified-facilitator',
    kind: 'facilitation',
    title:
      'Training of Facilitators for SDG indicator 6.5.1 (Integrated Water Resources Management)',
    role: 'Certified facilitator',
    org: 'Cap-Net / Global Water Partnership / UNEP-DHI',
    detail:
      'Accredited to facilitate national assessments of the degree of integrated water resources management implementation.',
  },
  {
    id: 'wa-plus-veget-workshops',
    kind: 'training',
    title: 'Water Accounting Plus (WA+) and VegET water-accounting workshops',
    role: 'Facilitator',
    org: 'International Water Management Institute',
    location: 'Ghana and Ethiopia',
    detail:
      'Also delivered Small Reservoirs Dashboard training in Accra.',
  },
  {
    id: 'ecowas-webinar-series-design',
    kind: 'facilitation',
    title:
      'ECOWAS sub-regional webinar series on supply-side regulation for electric mobility',
    role: 'Designer and lead facilitator',
    org: 'UNEP / ClimateWorks Foundation',
    detail: 'Reached 51 stakeholders across 9 ECOWAS countries.',
  },
  {
    id: 'uenr-teaching-assistantship',
    kind: 'teaching',
    title:
      'Water resources engineering, GIS, integrated water resources management, geo-environmental engineering and urban drainage',
    role: 'Teaching assistant',
    org: 'University of Energy and Natural Resources',
  },
  {
    id: 'rcees-supervision',
    kind: 'teaching',
    title: 'Undergraduate research supervision and graduate thesis development',
    role: 'Supervisor and contributor',
    org: 'Regional Centre for Energy and Environmental Sustainability (RCEES)',
  },
  {
    id: 'eu-knowledge-policy-frameworks',
    kind: 'facilitation',
    title:
      'EU knowledge and policy frameworks — institutional architecture, decision-making cycles, Global Gateway and the EU–Ghana cooperation framework',
    role: 'External expert facilitator',
  },
  {
    id: 'lcoy-ghana-2025-conference-manager',
    kind: 'conference',
    title: 'Local Conference of Youth (LCOY) Ghana',
    role: 'Conference Manager',
    org: 'UNFCCC / YOUNGO',
    period: 'Sep 2025',
    detail:
      'Coordinated planning and delivery for over 500 registered young leaders, civil society groups and policymakers feeding into the UNFCCC process.',
  },
  {
    id: 'tsinghua-global-youth-dialogue-2026',
    kind: 'conference',
    title: 'Fourth Tsinghua Global Youth Dialogue (TGYD 2026)',
    role: 'Delegate and speaker',
    org: 'Tsinghua University',
    period: 'Jun – Jul 2026',
    location: 'Hangzhou, Shanghai and Beijing, China',
    detail:
      'One of 120 delegates selected from 5,162 applicants under the theme “Bridging the Divides through Innovation”; presented on supply-side determinants of Africa’s electric vehicle transition.',
  },
  {
    id: 'graduate-students-association-presidency',
    kind: 'leadership',
    title: 'Graduate Students Association; University Governing Council',
    role: 'President; Student Representative',
    org: 'University of Energy and Natural Resources',
    detail:
      'Carried graduate student positions into deliberations on academic policy, fees, welfare and infrastructure at the university’s highest decision-making organ.',
  },
  {
    id: 'ghana-think-foundation-barcamp',
    kind: 'leadership',
    title: 'Ghana Think Foundation, Bono Region — Barcamp Sunyani',
    role: 'Coordinator; Mentorship Coordinator',
    period: 'Oct 2020 – Present',
    detail:
      'Led 20 radio outreaches on volunteerism as a tool for nation-building; facilitated mentoring sessions for the National Science and Maths Quiz.',
  },
  {
    id: 'junior-camp-ghana-mentor',
    kind: 'leadership',
    title: 'Junior Camp Ghana',
    role: 'Mentor',
    period: '2021 – Present',
    detail:
      'Guides senior high school students through transitions into tertiary education and vocational pathways.',
  },
  {
    id: 'debate-coaching-adjudication',
    kind: 'leadership',
    title:
      'Ghana Universities Debate Association and British Parliamentary debate circuit',
    role: 'Coach and accredited adjudicator',
    period: '2019 – Present',
    detail:
      'National championship results and two international coaching awards; competed at African and World University Debating Championships.',
  },
] as const satisfies readonly SpeakingEntry[]

export function speakingByKind(kind: SpeakingKind): readonly SpeakingEntry[] {
  return SPEAKING.filter((s) => s.kind === kind)
}
