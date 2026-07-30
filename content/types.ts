/**
 * Typed content model for romeotkoduah.org.
 *
 * Every record in `content/` is plain data typed against the interfaces below.
 * No React, no runtime dependencies — these modules are safe to import from
 * server components, build scripts and tests alike.
 *
 * Array members are declared `readonly` so that the data modules can use
 * `as const satisfies readonly X[]`, keeping the literals narrow while still
 * being checked against the shape.
 */

/* -------------------------------------------------------------------------- */
/* Practices                                                                   */
/* -------------------------------------------------------------------------- */

export type Practice =
  | 'research'
  | 'consulting'
  | 'systems'
  | 'communications'
  | 'speaking'

export interface PracticeMeta {
  /** Stable key, matches `Project.practice`. */
  key: Practice
  /** Full label, e.g. "Research & Hydrology". */
  label: string
  /** Short label for nav and chips, e.g. "Research". */
  short: string
  /** Route for the practice page, e.g. "/research". */
  href: string
  /** Accent colour, hex. */
  accent: string
  /** One or two sentences describing the practice. */
  blurb: string
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export interface Project {
  /** kebab-case, stable; doubles as the image folder name. */
  slug: string
  title: string
  practice: Practice
  /** Commissioning or host institution. */
  org: string
  role: string
  period: string
  /** Programme budget where the CV states one, e.g. "€2,499,675". */
  funding?: string
  /** One or two sentences — card copy. */
  summary: string
  /** Two to four paragraphs — detail page. */
  body: readonly string[]
  /** Reports, dashboards, datasets, publications produced. */
  outputs?: readonly string[]
  /** Institutions convened or collaborated with. */
  partners?: readonly string[]
  tags: readonly string[]
  /** Live URL or GitHub repository. */
  href?: string
  featured?: boolean
}

/* -------------------------------------------------------------------------- */
/* Publications                                                                */
/* -------------------------------------------------------------------------- */

export type PublicationKind = 'journal' | 'under-review' | 'report'

export interface Publication {
  /** Stable identifier, kebab-case. */
  id: string
  kind: PublicationKind
  /** Full author string in CV order, or the issuing body for reports. */
  authors?: string
  /** Publication or issue year; omitted for manuscripts under review. */
  year?: string
  title: string
  /** Journal, series or publisher. */
  venue?: string
  /** Volume, issue, article number, or equivalent locator. */
  locator?: string
  /** Status or availability note, e.g. "Preprint available on SSRN". */
  note?: string
}

/* -------------------------------------------------------------------------- */
/* Education                                                                   */
/* -------------------------------------------------------------------------- */

export interface EducationEntry {
  id: string
  degree: string
  institution: string
  location: string
  period: string
  /** Scholarship or funding attached to the programme. */
  award?: string
  thesis?: string
}

/* -------------------------------------------------------------------------- */
/* Awards, certifications, memberships                                         */
/* -------------------------------------------------------------------------- */

export interface Award {
  id: string
  year: string
  title: string
  /** Awarding body or programme. */
  org?: string
  /** Selection detail or citation. */
  detail?: string
}

export interface Certification {
  id: string
  year: string
  title: string
  /** Awarding institution, where the CV names one. */
  issuer?: string
}

export interface Membership {
  id: string
  /** Grade or role held, e.g. "Professional Engineer", "Member". */
  role: string
  org: string
  /** Post-nominal or registration abbreviation, e.g. "PE-GhIE". */
  credential?: string
}

/* -------------------------------------------------------------------------- */
/* Speaking, teaching and facilitation                                         */
/* -------------------------------------------------------------------------- */

export type SpeakingKind =
  | 'facilitation'
  | 'conference'
  | 'training'
  | 'teaching'
  | 'leadership'

export interface SpeakingEntry {
  id: string
  kind: SpeakingKind
  title: string
  role: string
  org?: string
  period?: string
  location?: string
  detail?: string
}

/* -------------------------------------------------------------------------- */
/* Skills                                                                      */
/* -------------------------------------------------------------------------- */

export interface SkillGroup {
  id: string
  title: string
  items: readonly string[]
}

/* -------------------------------------------------------------------------- */
/* Profile                                                                     */
/* -------------------------------------------------------------------------- */

export interface ContactLink {
  /** Display label, e.g. "Email". */
  label: string
  /** Human-readable value, e.g. "romeo.tweneboahkoduah@gmail.com". */
  value: string
  /** Fully-qualified href, including `mailto:` where applicable. */
  href: string
}

export interface Profile {
  name: string
  /** Short professional title, one line. */
  title: string
  location: string
  /** Two to three sentences for the hero. */
  hero: string
  /** Three paragraphs for the about page. */
  bio: readonly string[]
  contact: readonly ContactLink[]
}

export interface Stat {
  value: number
  suffix?: string
  label: string
}
