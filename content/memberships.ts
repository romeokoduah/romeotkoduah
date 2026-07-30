import type { Membership } from './types'

export const MEMBERSHIPS = [
  {
    id: 'ghie-professional-engineer',
    role: 'Professional Engineer',
    org: 'Ghana Institution of Engineering',
    credential: 'PE-GhIE',
  },
  {
    id: 'waimm',
    role: 'Member',
    org: 'West African Institute of Mining and Metallurgy',
    credential: 'MWAIMM',
  },
  {
    id: 'rural-water-supply-network',
    role: 'Member',
    org: 'Rural Water Supply Network',
  },
  {
    id: 'unesco-groundwater-youth-network',
    role: 'Member',
    org: 'UNESCO Groundwater Youth Network',
  },
] as const satisfies readonly Membership[]
