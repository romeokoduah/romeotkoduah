import type { SkillGroup } from './types'

export const SKILLS = [
  {
    id: 'geospatial-and-remote-sensing',
    title: 'Geospatial and Remote Sensing',
    items: [
      'QGIS',
      'ArcGIS',
      'Google Earth Engine',
      'Remote sensing',
      'Earth observation',
      'Spatial analysis',
    ],
  },
  {
    id: 'hydrology-and-water-resources',
    title: 'Hydrology and Water Resources',
    items: [
      'Hydrological modelling',
      'Water budget estimation',
      'River basin characterisation',
      'Eco-hydrology',
      'Hydropower potential assessment',
      'SWAT',
      'VegET',
      'mizuRoute',
      'mizuLake',
      'WEAP',
      'Water Accounting Plus (WA+)',
    ],
  },
  {
    id: 'modelling-and-data-science',
    title: 'Modelling and Data Science',
    items: [
      'Machine learning',
      'Random Forest',
      'Python',
      'R',
      'SPSS',
      'OriginPro graphing',
      'Climate modelling',
      'SDGs modelling',
    ],
  },
  {
    id: 'energy-and-systems-planning',
    title: 'Energy and Systems Planning',
    items: [
      'Energy planning',
      'OSeMOSYS',
      'CLEWS water–energy–food modelling',
      'Small hydropower siting',
      'Solar PV feasibility assessment',
    ],
  },
  {
    id: 'software-and-platforms',
    title: 'Software and Platforms',
    items: [
      'Next.js',
      'React',
      'TypeScript',
      'PostgreSQL',
      'PostGIS',
      'Serverless Postgres',
      'KoboToolbox',
    ],
  },
  {
    id: 'policy-and-programme',
    title: 'Policy and Programme',
    items: [
      'Environmental impact assessment',
      'Environmental and social management planning',
      'Article 6.2 carbon market design',
      'MRV and baseline design',
      'NDC alignment and reporting',
      'Stakeholder convening and facilitation',
    ],
  },
] as const satisfies readonly SkillGroup[]
