/**
 * Photographs that open pages. Event photographs are Romeo's own (the
 * organisers' official images). Pictures under /images/world/ are credited
 * Wikimedia Commons photographs of the Volta basin; their credit line is
 * carried here and shown beside them.
 */
export interface PagePhoto {
  src: string
  alt: string
  /** CSS object-position. */
  position?: string
  /** Credit shown under the picture, for pictures that are not Romeo's own. */
  credit?: string
}

export const PRACTICE_PHOTOS: Record<
  'research' | 'consulting' | 'systems' | 'communications' | 'speaking',
  PagePhoto
> = {
  research: {
    src: '/images/world/kogendo-p-dgre-white-volta-mogre-wa.jpg',
    alt: 'A canoe crossing the White Volta at Daboya',
    position: '62% center',
    credit: 'White Volta at Daboya. Photo: Cdilalo47, CC BY-SA 4.0, via Wikimedia Commons.',
  },
  consulting: {
    src: '/images/blog/atec-lsc-ghana/programme-presentation.jpg',
    alt: 'Presenting the programme design at the ATEC eCook consultation, Accra',
  },
  systems: {
    src: '/images/blog/unicef-startup-lab-guardian/group-photo.jpg',
    alt: 'Teams at the UNICEF StartUp Lab pitch day in Accra',
  },
  communications: {
    src: '/images/blog/undp-sdg-dialogue-2026/consultation-room.jpg',
    alt: 'The consultation room at the UNDP Ghana SDG dialogue, 2026',
    position: 'center 40%',
  },
  speaking: {
    src: '/images/blog/ysb-ghana-eu-training/climate-pitch.jpg',
    alt: 'Participants presenting a climate pitch at the Youth Sounding Board Ghana training',
  },
}

export const PAGE_PHOTOS = {
  work: {
    src: '/images/world/white-volta-1.jpg',
    alt: 'The White Volta in flood during the rainy season near Tamale',
    position: 'center 55%',
    credit: 'White Volta near Tamale. Photo: Nimatu15, CC BY-SA 4.0, via Wikimedia Commons.',
  },
  publications: {
    src: '/images/world/spillway-of-akosombo-dam.jpg',
    alt: 'The spillway of Akosombo dam on the Volta',
    credit: 'Akosombo spillway. Photo: ZSM, CC BY-SA 3.0, via Wikimedia Commons.',
  },
  contact: {
    src: '/images/world/volta-asuogyaman-p1090982.jpg',
    alt: 'A small boat on the lower Volta near Atimpoku',
    credit: 'Lower Volta near Atimpoku. Photo: Matti Blume, CC BY-SA 4.0, via Wikimedia Commons.',
  },
} satisfies Record<string, PagePhoto>
