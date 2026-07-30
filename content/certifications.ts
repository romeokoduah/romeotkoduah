import type { Certification } from './types'

export const CERTIFICATIONS = [
  {
    id: 'fao-young-agri-entrepreneurs',
    year: '2026',
    title:
      'Supporting Young Agri-Entrepreneurs with Responsible Agricultural Investment Projects',
    issuer: 'Food and Agriculture Organization of the United Nations',
  },
  {
    id: 'fao-gender-responsive-policy',
    year: '2026',
    title:
      'Building a Gender-Responsive Policy and Legal Framework for Agricultural Investment and Supply Chains',
    issuer: 'Food and Agriculture Organization of the United Nations',
  },
  {
    id: 'open-africa-power-certificate-of-excellence',
    year: '2025',
    title: 'Open Africa Power Programme, Certificate of Excellence',
    issuer: 'Sustainable Energy for All and Enel Foundation',
  },
  {
    id: 'iwmi-veget-mizuroute-wa-plus',
    year: '2025',
    title:
      'Hydrological Modelling and Discharge Estimation using VegET–mizuRoute, and Introduction to Water Accounting Plus (WA+)',
    issuer: 'International Water Management Institute',
  },
  {
    id: 'iea-africa-energy-efficiency-policy-week',
    year: '2025',
    title: 'Africa Energy Efficiency Policy Training Week, Transport Division',
    issuer: 'International Energy Agency',
  },
  {
    id: 'loa-research-communication-programme',
    year: '2024–25',
    title: 'Research Communication Programme',
    issuer: 'Leaders of Africa Institute',
  },
  {
    id: 'adaptive-residual-risk-management',
    year: '2024',
    title: 'Adaptive and Residual Risk Management',
    issuer: 'Trust Training Limited',
  },
  {
    id: 'epic-africa-clews-summer-school',
    year: '2024',
    title: 'EPIC Africa Summer School on CLEWS-based Water–Energy–Food Modelling',
    issuer: 'University of Energy and Natural Resources',
  },
  {
    id: 'pmp-preparation',
    year: '2023',
    title: 'Project Management Professional (PMP) preparation',
    issuer: 'Project Management Institute / Cambridge Centre of Excellence',
  },
  {
    id: 'nebosh-igc',
    year: '2023',
    title:
      'International General Certificate in Occupational Health and Safety (IGC)',
    issuer: 'NEBOSH, United Kingdom',
  },
  {
    id: 'sdg-651-training-of-facilitators',
    year: '2023',
    title: 'Training of Facilitators for SDG 6.5.1',
    issuer: 'Cap-Net, Global Water Partnership and UNEP-DHI',
  },
  {
    id: 'small-hydropower-seminar-china',
    year: '2023',
    title: 'Seminar on Small Hydropower and Sustainable Development',
    issuer: 'Ministry of Commerce, People’s Republic of China',
  },
  {
    id: 'oxford-school-of-climate-change',
    year: '2023',
    title: 'Oxford School of Climate Change',
    issuer: 'University of Oxford',
  },
  {
    id: 'nasa-arset-fires-watershed-health',
    year: '2023',
    title: 'Assessing the Impacts of Fires on Watershed Health',
    issuer: 'NASA Applied Remote Sensing Training (ARSET)',
  },
  {
    id: 'drone-and-data-technology-level-1',
    year: '2023',
    title: 'Drone and Data Technology, Level 1',
    issuer: 'African Drone and Data Academy',
  },
  {
    id: 'lean-six-sigma-white-belt',
    year: '2023',
    title: 'Lean Six Sigma White Belt',
  },
] as const satisfies readonly Certification[]
