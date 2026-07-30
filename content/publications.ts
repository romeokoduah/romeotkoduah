import type { Publication, PublicationKind } from './types'

export const PUBLICATIONS = [
  /* ---------------------------- Journal articles ---------------------------- */
  {
    id: 'arthur-2026-water-stress-conflict-risk',
    kind: 'journal',
    authors:
      'Arthur, E. T., Ofosu, E. A., Minkah, A. A., Domfeh, M. K., Ampomah, B., Yeboah, S. I. I. K., Otchere, B. M. A. P., Amoah, T., Bakuri, R. W., Koduah, R. T., & Akowuah, S. O.',
    year: '2026',
    title:
      'A multi-criteria geospatial assessment of water stress, demand competition, and conflict risk in a tropical river basin of Ghana',
    venue: 'Hydrology Research',
  },
  {
    id: 'agyemang-boakye-2024-pumpum-small-hydropower',
    kind: 'journal',
    authors:
      'Agyemang-Boakye, B., Ofosu, E. A., Domfeh, M. K., Dekongmen, B. W., Koduah, R. T., Bakuri, R. W., & Kpiebaya, P.',
    year: '2024',
    title:
      'Potential for small hydropower development on the Pumpum River of Ghana using remote sensing and the Soil Water Assessment Tool',
    venue: 'Green Technologies and Sustainability',
    locator: '2(1), 100063',
  },

  /* ------------------------- Manuscripts under review ------------------------ */
  {
    id: 'koduah-white-volta-water-budgets',
    kind: 'under-review',
    authors:
      'Koduah, R. T., Kpiebaya, P., Ofosu, E. A., Akpoti, K., Dekongmen, B. W., Bakuri, R. W., Okyereh, S. A., & Agyemang-Boakye, B.',
    title:
      'Using Earth observations to monitor water budgets for river basin management in the White Volta River Basin',
    note: 'Under review',
  },
  {
    id: 'otchere-tano-water-demand-abstraction',
    kind: 'under-review',
    authors:
      'Otchere, B. M. A. P., Ofosu-Antwi, E., Domfeh, M. K., Minkah, A. A., Koduah, R. T., et al.',
    title:
      'Geospatial mapping and analysis of surface water demand, abstraction and water yield in the Tano River Basin of Ghana',
    note: 'Under review; preprint available on SSRN',
  },

  /* --------------------- Policy and technical reports ----------------------- */
  {
    id: 'ghana-zev-supply-side-regulation',
    kind: 'report',
    year: '2026',
    title: 'Ghana Zero-Emission Vehicle Supply-Side Regulation — draft regulation',
    venue: 'UNEP / ClimateWorks Foundation',
  },
  {
    id: 'gycar-2025-2030',
    kind: 'report',
    year: '2025',
    title: 'Ghana Youth Climate Action Roadmap (GYCAR) 2025–2030',
    note: 'Lead author',
  },
  {
    id: 'national-youth-climate-statement',
    kind: 'report',
    year: '2025',
    title: 'National Youth Climate Statement, Ghana',
  },
  {
    id: 'spis-investment-plan',
    kind: 'report',
    year: '2025',
    title:
      'Investment Plan for Financing Solar-Powered Irrigation in Ghana (SPIS)',
    note: 'Co-author',
  },
  {
    id: 'undp-green-business-jobs-tracker-concept-note',
    kind: 'report',
    year: '2026',
    title:
      'Green Business and Jobs Tracker concept note and design framework, Ghana',
    venue: 'United Nations Development Programme (UNDP)',
  },
  {
    id: 'lerma-santiago-discharge-outputs',
    kind: 'report',
    year: '2026',
    title:
      'Discharge modelling and evaluation outputs for the Lerma–Santiago Basin, Mexico — multi-product comparison, deviation analysis and dashboard-ready environmental flow indicators',
    venue: 'International Water Management Institute (IWMI)',
  },
] as const satisfies readonly Publication[]

export const PUBLICATION_SECTIONS = [
  { kind: 'journal', title: 'Peer-Reviewed Journal Articles' },
  { kind: 'under-review', title: 'Manuscripts Under Review' },
  { kind: 'report', title: 'Policy and Technical Reports' },
] as const satisfies readonly { kind: PublicationKind; title: string }[]

export function publicationsByKind(kind: PublicationKind): readonly Publication[] {
  return PUBLICATIONS.filter((p) => p.kind === kind)
}
