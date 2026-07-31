/**
 * Which institution's mark represents each project.
 *
 * Each slug maps to an ordered list of logo keys — the first one whose file
 * actually exists in `public/images/logos/` wins. That lets a project fall back
 * from a specific centre to its parent university, or from an implementer to
 * its funder, and finally to the typographic monogram when nothing is present.
 *
 * Logos identify organisations Romeo has actually worked with. Projects are
 * deliberately left unmapped where a mark would imply an affiliation that does
 * not exist — GUARDIAN was a finalist in a UNICEF pitch, not a UNICEF project,
 * so it keeps its monogram.
 */
export const LOGO_KEYS_BY_SLUG: Record<string, readonly string[]> = {
  // Research & Hydrology
  'iwmi-water-data-science': ['iwmi'],
  'lerma-santiago-mexico': ['iwmi'],
  'diwasa-continental-hydrology': ['iwmi', 'world-bank'],
  'rcees-water-budgets-and-hydropower': ['rcees', 'uenr'],
  'sustaindam-hydropower-climate': ['belmont-forum'],
  'aqua-equity-small-hydropower': ['rcees', 'uenr'],
  'white-volta-water-budgets': ['uenr', 'world-bank'],
  'rcees-teaching-research-assistantship': ['rcees', 'uenr'],

  // Policy & Consulting
  'zev-supply-side-regulation': ['unep', 'climateworks'],
  'moving-impact': ['imperial', 'ukri'],
  'epic-africa-clews': ['european-union'],
  'ndc-action-e-mobility': ['unep'],
  'solar-powered-irrigation-systems': ['bmz'],
  'government-goes-solar': ['ghana-moen', 'kfw'],

  // AI & Digital Systems
  'undp-green-skills-jobs-tracker': ['undp'],
  'plastics-circularity-platform': ['iom'],
  'nwa-tracker': ['iwmi'],
  'uenr-alumni-career-hub': ['uenr'],

  // Communications & Knowledge Management
  'rcees-knowledge-management': ['rcees', 'uenr'],
  'proreg-renewable-energy-education': ['daad', 'tu-berlin'],
  'ndc-action-climate-smart-agriculture': ['unep'],

  // Training, Facilitation & Speaking
  'sdg-651-facilitation': ['capnet', 'gwp'],
  'water-accounting-workshops': ['iwmi'],
  'ecowas-webinar-series': ['ecowas', 'unep'],
  'lcoy-ghana-2025': ['unfccc'],
  'tsinghua-global-youth-dialogue': ['tsinghua'],
  'graduate-students-association': ['uenr'],
  'ghana-think-foundation': ['ghana-think'],
}
