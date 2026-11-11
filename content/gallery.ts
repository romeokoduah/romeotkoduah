export interface GalleryPhoto {
  /** Basename under public/images/gallery/<album>/: <file>.webp and <file>-thumb.webp */
  file: string
  width: number
  height: number
  /** Average colour, the blur-up placeholder. */
  tone: string
  caption: string
}

export interface GalleryAlbum {
  slug: string
  title: string
  description: string
  /** Date the photographs were taken, ISO. */
  takenAt: string
  photos: GalleryPhoto[]
}

/**
 * Albums shipped with the site rather than uploaded through the dashboard.
 * The deploy seeds them like the starter posts: an album that already exists
 * is left alone, and a photo is added only if its URL is not already present,
 * so dashboard edits survive. Photographs are the organisers' official
 * images; the first photo is the album cover.
 */
export const GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    slug: 'atec-lsc-accra-2026',
    title: 'ATEC eCook Local Stakeholder Consultation, Accra',
    description:
      'Local Stakeholder Consultation for the ATEC Ghana eCook clean cooking programme, Dr. Frempong Hall, CSIR, Accra, 15 September 2026. Photographs: ATEC.',
    takenAt: '2026-09-15T10:00:00Z',
    photos: [
      { file: '01', width: 2000, height: 1333, tone: '#8f7d7e', caption: 'Participants and the ATEC team at the close of the Accra session' },
      { file: '02', width: 2000, height: 1333, tone: '#b1a190', caption: 'Opening the Local Stakeholder Consultation for Eco-Lution Consults' },
      { file: '03', width: 2000, height: 1333, tone: '#7b5a43', caption: 'The ATEC team introducing the session' },
      { file: '04', width: 1333, height: 2000, tone: '#8d6f63', caption: 'ATEC presenting the programme rationale' },
      { file: '05', width: 2000, height: 1333, tone: '#9d8172', caption: 'Dr. Frempong Hall, CSIR, during the morning presentations' },
      { file: '06', width: 2000, height: 1333, tone: '#896e5d', caption: 'Presentation of the programme design and digital monitoring system' },
      { file: '07', width: 2000, height: 1333, tone: '#a48978', caption: 'Explaining the carbon revenue pathway' },
      { file: '08', width: 1333, height: 2000, tone: '#c79f94', caption: 'A participant raising a question in plenary' },
      { file: '09', width: 2000, height: 1333, tone: '#a17a68', caption: 'Discussion from the floor' },
      { file: '10', width: 2000, height: 1333, tone: '#977766', caption: 'Participants following the plenary discussion' },
      { file: '11', width: 2000, height: 1333, tone: '#8e6d5c', caption: 'Speaking during the plenary session' },
      { file: '12', width: 2000, height: 1333, tone: '#8b756e', caption: 'Showing the eCook induction cooker to participants' },
      { file: '13', width: 2000, height: 1333, tone: '#8f8378', caption: 'The eCook two-plate induction cooker' },
      { file: '14', width: 2000, height: 1333, tone: '#939098', caption: 'Registration and participant materials' },
      { file: '15', width: 2000, height: 1333, tone: '#91797f', caption: 'The ATEC team with representatives at the Accra hub' },
      { file: '16', width: 2000, height: 1333, tone: '#8b7674', caption: 'Conversations after the session' },
    ],
  },
  {
    slug: 'unicef-startup-lab-pitch-day-2026',
    title: 'UNICEF StartUp Lab Pitch Day, Accra',
    description:
      'Pitching GUARDIAN at the UNICEF StartUp Lab Reducing Child Labour and Trafficking Challenge, UNICEF Ghana office, Accra, 9 June 2026.',
    takenAt: '2026-06-09T13:30:00Z',
    photos: [
      { file: '01', width: 2000, height: 1333, tone: '#9b97ab', caption: 'Opening the GUARDIAN pitch' },
      { file: '02', width: 2000, height: 1333, tone: '#b0a59c', caption: 'Pitching GUARDIAN to the judges' },
      { file: '03', width: 2000, height: 1333, tone: '#aaa3a7', caption: 'Setting out the proposed validation pilot' },
      { file: '04', width: 2000, height: 1333, tone: '#b2a8a4', caption: 'Presenting the case for faster referrals' },
      { file: '05', width: 2000, height: 1333, tone: '#9c9184', caption: 'The pitch room at the UNICEF StartUp Lab' },
      { file: '06', width: 2000, height: 1333, tone: '#a7a1a3', caption: 'Walking the judges through the platform' },
      { file: '07', width: 2000, height: 1221, tone: '#b0bfcb', caption: 'Receiving the certificate of participation' },
      { file: '08', width: 2000, height: 1333, tone: '#969291', caption: 'Finalists and the UNICEF StartUp Lab team at UNICEF House' },
      { file: '09', width: 1333, height: 2000, tone: '#888b9a', caption: 'Portrait at UNICEF House, Accra' },
      { file: '10', width: 2000, height: 1333, tone: '#a28f7c', caption: 'Teams preparing before Pitch Day' },
      { file: '11', width: 2000, height: 1333, tone: '#97948f', caption: 'Another finalist presenting to the judges' },
    ],
  },
  {
    slug: 'african-youth-conference-2025',
    title: 'African Youth Conference 2025, Accra',
    description:
      'African Youth Conference on Natural Resources and Environmental Governance, La Palm Royal Beach Hotel, Accra, 11-13 September 2025. Photographs: AYC 2025 official photography.',
    takenAt: '2025-09-12T12:00:00Z',
    photos: [
      { file: '01', width: 2000, height: 1333, tone: '#606484', caption: 'A plenary panel on the main stage' },
      { file: '02', width: 2000, height: 1333, tone: '#615355', caption: 'Participants at the African Youth Conference 2025' },
      { file: '03', width: 2000, height: 1333, tone: '#525d7f', caption: 'The main stage at La Palm Royal Beach Hotel' },
      { file: '04', width: 2000, height: 1333, tone: '#725c85', caption: 'A speaker at the podium on day two' },
      { file: '05', width: 2000, height: 1333, tone: '#173b83', caption: 'A speaker on the main stage' },
      { file: '06', width: 2000, height: 1333, tone: '#8485a3', caption: 'Panel discussion on day two' },
      { file: '07', width: 2000, height: 1333, tone: '#606e8a', caption: 'Panellists on the main stage' },
      { file: '08', width: 2000, height: 1333, tone: '#514b4b', caption: 'The conference hall on day two' },
      { file: '09', width: 2000, height: 1333, tone: '#81a1c1', caption: 'On the panel at the UNIYIA side event' },
      { file: '10', width: 1333, height: 2000, tone: '#848091', caption: 'Speaking at the UNIYIA side event on green entrepreneurship and skills' },
      { file: '11', width: 2000, height: 1333, tone: '#81849a', caption: 'The UNIYIA side event panel on the main stage' },
      { file: '12', width: 2000, height: 1333, tone: '#777c9b', caption: 'The side event panel in session' },
      { file: '13', width: 800, height: 533, tone: '#7b6b71', caption: 'The UNIYIA side event panellists' },
    ],
  },
  {
    slug: 'undp-sdg-dialogue-2026',
    title: "UN Dialogue on Accelerating Ghana's SDG Progress, Accra",
    description:
      "High-level multi-stakeholder dialogue on accelerating Ghana's SDG progress (2027-2030), convened by UNDP and the UN Resident Coordinator's Office in Ghana, March 2026. Photographs: James Amankwaa Yeboah Korang.",
    takenAt: '2026-03-17T10:00:00Z',
    photos: [
      { file: '01', width: 1152, height: 1536, tone: '#9e948f', caption: 'With youth delegate James Amankwaa Yeboah Korang at the UN offices in Accra' },
      { file: '02', width: 1152, height: 1536, tone: '#8b8f89', caption: 'The UN Country Analysis Consultation session' },
      { file: '03', width: 845, height: 1536, tone: '#666665', caption: 'Participants during the consultation' },
    ],
  },
]
