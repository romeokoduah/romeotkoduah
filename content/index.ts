/**
 * Content barrel.
 *
 * Every page and component imports from `@/content` rather than reaching into
 * individual modules, so that the data layer can be reorganised without
 * touching call sites.
 */

export type {
  Award,
  Certification,
  ContactLink,
  EducationEntry,
  Membership,
  Practice,
  PracticeMeta,
  Profile,
  Project,
  Publication,
  PublicationKind,
  SkillGroup,
  SpeakingEntry,
  SpeakingKind,
  Stat,
} from './types'

export { PROFILE, PRACTICES, PRACTICE_BY_KEY, STATS } from './profile'
export {
  PROJECTS,
  FEATURED_PROJECTS,
  getProject,
  projectsByPractice,
} from './projects'
export type { ProjectSlug } from './projects'
export {
  PUBLICATIONS,
  PUBLICATION_SECTIONS,
  publicationsByKind,
} from './publications'
export { EDUCATION } from './education'
export { AWARDS } from './awards'
export { CERTIFICATIONS } from './certifications'
export { MEMBERSHIPS } from './memberships'
export { SPEAKING, speakingByKind } from './speaking'
export { SKILLS } from './skills'
