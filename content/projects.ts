import type { Practice, Project } from './types'

/**
 * Every appointment, consultancy, platform and convening role from the CV,
 * assigned to exactly one practice. Slugs are stable and double as the image
 * folder name under `public/images/projects/<slug>/`.
 */
export const PROJECTS = [
  /* ------------------------------------------------------------------ */
  /* Research & Hydrology                                                */
  /* ------------------------------------------------------------------ */
  {
    slug: 'iwmi-water-data-science',
    title: 'Water Data Science for Action',
    practice: 'research',
    org: 'International Water Management Institute (IWMI), West Africa Office, Accra',
    role: 'Research Consultant',
    period: 'May 2025 – Present',
    summary:
      'Research consultancy at IWMI’s West Africa office, converting earth observation and distributed hydrological modelling into decision-ready water data for basin managers and national agencies.',
    body: [
      'The consultancy sits inside IWMI’s water data science programme, where the question is not only what the hydrology says but whether anyone downstream of the model can act on it. The brief runs from model configuration and simulation through validation and trend analysis to the figures, summaries and indicator sets that reach a dashboard or a basin authority.',
      'Two workstreams sit under the appointment: the Google-funded Lerma–Santiago Basin study in Mexico, which pairs naturalised and reservoir-regulated discharge simulation to characterise managed flow, and DIWASA V2, the World Bank-funded continental hydrology and discharge modelling programme covering Africa from 1992 to 2050.',
      'Both share a method. Open modelling chains — VegET for water balance, mizuRoute for river routing, mizuLake for reservoir regulation — are run against MERIT hydrography and satellite-derived inputs, then compared across products so that the spread between them becomes part of the answer rather than a footnote to it.',
    ],
    tags: [
      'Hydrological modelling',
      'Earth observation',
      'Water accounting',
      'mizuRoute',
      'VegET',
    ],
  },
  {
    slug: 'lerma-santiago-mexico',
    title: 'Lerma–Santiago Basin Discharge and Environmental Flows',
    practice: 'research',
    org: 'International Water Management Institute — Google-funded Mexico Project',
    role: 'Research Consultant, Hydrological Modelling',
    period: 'January – June 2026',
    funding: 'Google-funded',
    summary:
      'Naturalised and reservoir-regulated discharge simulation for Mexico’s Lerma–Santiago Basin, producing the environmental-flow indicators behind a national e-flow dashboard.',
    body: [
      'The Lerma–Santiago is one of Mexico’s most heavily managed basins, which makes the gap between what the river would do and what the river is allowed to do the central analytical object. The study addresses that gap directly by simulating both conditions and reading the difference.',
      'mizuRoute was used to produce naturalised discharge across the basin network, establishing the counterfactual hydrology. mizuLake was then run to represent reservoir-regulated discharge, reproducing managed flow conditions under the basin’s storage and release regime.',
      'A multi-product discharge comparison and deviation analysis followed, testing the simulations against alternative discharge products so that the uncertainty band travels with the result. The outputs were then reduced to environmental-flow indicators formatted for the Mexico e-flow dashboard, where they support allocation decisions rather than sitting in a model archive.',
    ],
    outputs: [
      'Naturalised discharge simulations for the basin (mizuRoute)',
      'Reservoir-regulated discharge simulations representing managed flow (mizuLake)',
      'Multi-product discharge comparison and deviation analysis',
      'Environmental-flow indicators prepared for the Mexico e-flow dashboard',
    ],
    tags: [
      'mizuRoute',
      'mizuLake',
      'Environmental flows',
      'Discharge modelling',
      'Reservoir regulation',
      'Mexico',
    ],
    featured: true,
  },
  {
    slug: 'diwasa-continental-hydrology',
    title: 'DIWASA — Continental Hydrology and Discharge Modelling V2',
    practice: 'research',
    org: 'International Water Management Institute',
    role: 'Research Consultant, Continental Discharge Modelling',
    period: 'January – October 2026',
    funding: 'World Bank funded',
    summary:
      'Continental-scale discharge modelling: MERIT-based VegET and mizuRoute baseline runs for 1992–2024, validated and extended through future-scenario simulation to 2050.',
    body: [
      'DIWASA V2 builds a continental hydrological baseline rather than a basin one, which changes both the data problem and the validation problem. The baseline runs pair VegET water balance output with mizuRoute river routing over MERIT hydrography, covering 1992 to 2024 — a thirty-three year record long enough for trend statements to mean something.',
      'On top of the baseline sit validation and future-scenario discharge simulations for 2026 to 2050, carrying the same modelling chain forward under scenario forcing so that historical behaviour and projected behaviour are produced by one consistent method.',
      'The analytical contribution was discharge trend analysis and visualisation across the modelled domain, together with basin-scale discharge summaries and the figure production that turns a continental simulation into something a basin authority or a World Bank task team can read.',
    ],
    outputs: [
      'MERIT-based VegET and mizuRoute baseline runs, 1992–2024',
      'Validation and future-scenario discharge simulations, 2026–2050',
      'Continental discharge trend analysis and visualisation',
      'Basin-scale discharge summaries and figure production',
    ],
    tags: [
      'Continental hydrology',
      'VegET',
      'mizuRoute',
      'MERIT',
      'Climate scenarios',
      'Trend analysis',
    ],
    featured: true,
  },
  {
    slug: 'rcees-water-budgets-and-hydropower',
    title: 'Basin Water Budgets and Small Hydropower Suitability',
    practice: 'research',
    org: 'Regional Centre for Energy and Environmental Sustainability (RCEES), University of Energy and Natural Resources',
    role: 'Senior Technical Officer and Project Communications Specialist',
    period: 'Sep 2020 – Jan 2024',
    summary:
      'Basin-level water budgets and small hydropower suitability assessment across Ghana’s western river systems, with machine learning applied to basin condition and water stress affecting energy generation.',
    body: [
      'The post combined a modelling brief with a Centre-wide technical one. Basin-level water budgets were generated using GIS and hydrological modelling, and small hydropower suitability assessments were carried out across Ghana’s western river systems, treating generation potential and water availability as one accounting problem.',
      'Machine learning in Python and R was applied to classify basin condition and predict water stress affecting energy generation — the analytical link between a hydrological state and an energy outcome, and the methodological basis for the small hydropower work that followed.',
      'Alongside the technical work the role carried a communications mandate, and it fed the Centre’s research pipeline: three successful competitive research grant applications were supported, undergraduate research projects supervised, and graduate thesis development supported at RCEES.',
    ],
    outputs: [
      'Basin-level water budget estimates for Ghana’s western river systems',
      'Small hydropower suitability assessments',
      'Machine learning classifiers for basin condition and water stress',
      'Contributions to three successful competitive research grant applications',
    ],
    tags: [
      'Water budgets',
      'GIS',
      'Machine learning',
      'Python',
      'R',
      'Small hydropower',
    ],
  },
  {
    slug: 'sustaindam-hydropower-climate',
    title: 'SUSTAINDAM — Hydropower and Climate Change in West Africa',
    practice: 'research',
    org: 'Belmont Forum',
    role: 'WEAP Analyst and Modeller',
    period: 'Nov 2022 – Jul 2024',
    funding: 'USD 77,000',
    summary:
      'Random Forest and WEAP analysis of climate sensitivity at the Akosombo and Kpong hydropower plants, combining land-use change dynamics with water–energy–food scenario planning.',
    body: [
      'Akosombo and Kpong carry a large share of Ghana’s generation, which makes their climate sensitivity a national question rather than a plant-level one. A Random Forest model was developed and implemented using lagged precipitation together with minimum and maximum temperature as predictors, to analyse energy generation at both plants.',
      'The analysis assessed the historical evolution of water-related activity around the dams and the sensitivity of each plant to climate variability, integrating land use and land cover change dynamics so that catchment transformation was treated as a driver rather than background.',
      'Water Evaluation and Planning (WEAP) analyses were then built and land-use trend scenarios proposed within the water–energy–food nexus. Combining top-down scenario forcing with bottom-up observed behaviour gave a planning basis that holds under compounded climate and land-use uncertainty rather than under one of them at a time.',
    ],
    outputs: [
      'Random Forest generation model for the Akosombo and Kpong plants',
      'Climate sensitivity assessment for both hydropower facilities',
      'WEAP water–energy–food scenario analyses',
      'Proposed land-use trend scenarios for long-term planning',
    ],
    tags: [
      'WEAP',
      'Random Forest',
      'Hydropower',
      'Climate variability',
      'Land use change',
      'Water–energy–food nexus',
    ],
  },
  {
    slug: 'aqua-equity-small-hydropower',
    title: 'Small Hydropower Assessment — Western Rivers of Ghana',
    practice: 'research',
    org: 'Aqua Equity (AqEq) with RCEES, University of Energy and Natural Resources',
    role: 'Technical Lead, Water Resources and Small Hydropower',
    period: 'Ongoing',
    summary:
      'Assessment of small hydropower potential along the Tano, Ankobra, Pra and Bia rivers, framing renewable generation and equitable water allocation as a single question rather than two competing ones.',
    body: [
      'The assessment covers small hydropower potential along four of Ghana’s western rivers — the Tano, Ankobra, Pra and Bia. Its framing is deliberate: generation potential and equitable water allocation are treated as one question, because a siting decision that ignores downstream allocation simply moves the conflict rather than resolving it.',
      'The technical work combines hydrological modelling, river basin mapping and energy generation simulation to identify viable installation sites across the four systems, with the basin characterisation carrying as much weight as the head-and-flow arithmetic.',
      'Outputs are the technical reports and siting recommendations that carry the findings into Ghana’s renewable energy and climate commitments, giving the assessment a route into national planning rather than a shelf in a project archive.',
    ],
    outputs: [
      'Hydrological modelling and river basin mapping for the Tano, Ankobra, Pra and Bia',
      'Energy generation simulation for candidate sites',
      'Technical reports and siting recommendations',
    ],
    tags: [
      'Small hydropower',
      'River basin mapping',
      'Generation simulation',
      'Water allocation',
      'Renewable energy',
    ],
  },
  {
    slug: 'white-volta-water-budgets',
    title: 'Earth Observation for Water Budgets — White Volta River Basin',
    practice: 'research',
    org: 'University of Energy and Natural Resources — World Bank Africa Centre of Excellence',
    role: 'MSc Researcher',
    period: 'Completed Dec 2022',
    funding: 'World Bank Africa Centre of Excellence Scholarship',
    summary:
      'MSc research using earth observation to monitor water budgets for river basin management in the White Volta, and the methodological foundation for the continental water accounting work that followed.',
    body: [
      'The thesis asked whether earth observation alone can support water budget monitoring at basin scale in a setting where ground gauging is sparse — the condition most West African basins are actually in. The White Volta, transboundary and agriculturally intensive, is a demanding test case for that claim.',
      'The work established the remote-sensing water accounting approach that runs through the later continental modelling: satellite-derived water balance components assembled into a basin budget that a river basin authority can maintain without a dense observation network.',
      'It was completed under the World Bank Africa Centre of Excellence Scholarship and is the basis of a manuscript currently under review, co-authored with colleagues at UENR and IWMI.',
    ],
    outputs: [
      'MSc thesis, Environmental Engineering and Management, UENR (2022)',
      'Manuscript under review: “Using Earth observations to monitor water budgets for river basin management in the White Volta River Basin”',
    ],
    tags: [
      'Earth observation',
      'Water budgets',
      'White Volta',
      'Remote sensing',
      'River basin management',
    ],
  },
  {
    slug: 'rcees-teaching-research-assistantship',
    title: 'Teaching and Research Assistantship',
    practice: 'research',
    org: 'Regional Centre for Energy and Environmental Sustainability (RCEES), University of Energy and Natural Resources',
    role: 'Teaching and Research Assistant',
    period: 'Sep 2019 – Aug 2020',
    summary:
      'Tutorial, laboratory and fieldwork support for undergraduate Integrated Water Resources Management and Urban Drainage, alongside departmental research assistance.',
    body: [
      'The first appointment at RCEES covered tutorial and teaching support for undergraduate courses in Integrated Water Resources Management and Urban Drainage — leading tutorial sessions, marking assignments and holding student consultations.',
      'Laboratory demonstrations and supervised student fieldwork formed the practical half of the role, guiding exercises, data collection and the use of measurement equipment.',
      'Departmental research activities were supported throughout — literature reviews, data collection and analysis, and preparation of figures and reports — with mentoring of junior students on coursework and projects alongside.',
    ],
    tags: [
      'Teaching',
      'Integrated water resources management',
      'Urban drainage',
      'Fieldwork',
      'Research support',
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Policy & Consulting                                                 */
  /* ------------------------------------------------------------------ */
  {
    slug: 'zev-supply-side-regulation',
    title: 'Ghana Zero-Emission Vehicle Supply-Side Regulation',
    practice: 'consulting',
    org: 'UN Environment Programme (UNEP) / ClimateWorks Foundation',
    role: 'Project Coordinator',
    period: 'Apr 2025 – Apr 2026',
    summary:
      'Coordination of Ghana’s first zero-emission vehicle supply-side regulatory framework, carried from technical modelling through national validation to a policy document formatted for government adoption.',
    body: [
      'Most electric vehicle policy in the region works on demand — incentives, charging, awareness. This programme worked the supply side: the standards and import conditions that determine which vehicles can enter the fleet at all. It produced Ghana’s first supply-side regulatory framework for zero-emission vehicles.',
      'The coordination ran the full distance, from technical modelling through a national validation workshop to a policy document formatted to National Development Planning Commission standards so that it could be taken up through the government’s own adoption route rather than requiring a parallel one.',
      'Getting there meant convening the Ministry of Transport, the Energy Commission, the Environmental Protection Agency, the DVLA, the Ghana Standards Authority, vehicle importers and dealers, and development partners around a single regulatory instrument — parties whose interests in the vehicle import market do not naturally align.',
      'Sub-regional dissemination followed through ECOWAS webinars reaching 51 stakeholders across 9 countries, translating a national instrument into a regional policy conversation. The policy brief, validation workshop report, ECOWAS dissemination report and the final NDPC-format policy document were co-authored as part of the work.',
    ],
    outputs: [
      'Draft Ghana zero-emission vehicle supply-side regulation',
      'Policy brief',
      'National validation workshop report',
      'ECOWAS dissemination report — 51 stakeholders across 9 countries',
      'Final policy document in NDPC format for government adoption',
    ],
    partners: [
      'Ministry of Transport',
      'Energy Commission',
      'Environmental Protection Agency',
      'Driver and Vehicle Licensing Authority (DVLA)',
      'Ghana Standards Authority',
      'Vehicle importers and dealers',
      'ECOWAS member states',
    ],
    tags: [
      'Electric mobility',
      'Regulation',
      'Standards',
      'ECOWAS',
      'Policy design',
      'Stakeholder convening',
    ],
    featured: true,
  },
  {
    slug: 'article-6-2-cookstove-carbon',
    title: 'Article 6.2 Cookstove Carbon Programme',
    practice: 'consulting',
    org: 'ATEC / DESS Ghana',
    role: 'Climate Policy and Stakeholder Engagement Lead',
    period: '2026',
    summary:
      'Direction of the climate policy workstream for a cooperative-approach carbon programme under Article 6.2 of the Paris Agreement, from authorisation requirements through to the household baseline instrument.',
    body: [
      'Article 6.2 turns a cookstove programme into a sovereign accounting question. The climate policy workstream aligns project design with Ghana’s authorisation requirements, corresponding-adjustment obligations and national carbon market framework — the conditions under which a mitigation outcome can legitimately transfer.',
      'Engagement runs across the Environmental Protection Agency, the Ministry of Environment, Science, Technology and Innovation, district authorities, distribution partners and participating households. That range is not incidental: a cooperative approach depends on consent and coordination at every level from the ministry to the kitchen.',
      'The DESS Ghana household baseline instrument was designed and deployed in KoboToolbox, establishing the fuel-use and stove-stacking baseline that underpins monitoring, reporting and verification — and therefore the integrity of the mitigation outcomes eventually issued. Stove stacking is where cookstove baselines usually fail, so measuring it directly is a deliberate design decision.',
    ],
    outputs: [
      'DESS Ghana household baseline instrument (KoboToolbox)',
      'Fuel-use and stove-stacking baseline for MRV',
      'Article 6.2 alignment and authorisation workstream',
    ],
    partners: [
      'Environmental Protection Agency',
      'Ministry of Environment, Science, Technology and Innovation',
      'District authorities',
      'Distribution partners',
    ],
    tags: [
      'Article 6.2',
      'Carbon markets',
      'Paris Agreement',
      'MRV',
      'Clean cooking',
      'KoboToolbox',
    ],
  },
  {
    slug: 'moving-impact',
    title: 'Moving IMPACT — Solar Mini-Grids and EV Charging',
    practice: 'consulting',
    org: 'Imperial College London / UK Research and Innovation (UKRI)',
    role: 'Stakeholder and Outreach Officer',
    period: 'Sep 2025 – Present',
    summary:
      'Stakeholder engagement for a multinational solar mini-grid and electric vehicle charging research programme spanning the United Kingdom, Kenya, Rwanda and Ghana.',
    body: [
      'Moving IMPACT asks what happens when solar mini-grids and electric vehicle charging are designed as one system rather than two, and tests the answer across four countries with very different grid conditions — the United Kingdom, Kenya, Rwanda and Ghana.',
      'The role manages stakeholder engagement across that spread, linking academic partners with transport and energy authorities and with civil society. Where a UKRI programme meets a national regulator, the constraint is rarely the research; it is whether the right institution is in the room early enough for the result to matter.',
    ],
    partners: [
      'Imperial College London',
      'Transport and energy authorities in Kenya, Rwanda and Ghana',
      'Civil society organisations',
    ],
    tags: [
      'Solar mini-grids',
      'EV charging',
      'Stakeholder engagement',
      'Multinational research',
      'Energy access',
    ],
  },
  {
    slug: 'epic-africa-clews',
    title: 'EPIC Africa — CLEWS Modelling for the Water–Energy–Food Nexus',
    practice: 'consulting',
    org: 'European Union, Horizon Europe',
    role: 'Project Communications Specialist and Data Analyst',
    period: 'Feb 2023 – Present',
    funding: '€2,499,675',
    summary:
      'Data analysis and partner communications for Work Package 6 of a €2.5 million Horizon Europe consortium modelling climate, land, energy and water systems for the water–energy–food nexus.',
    body: [
      'EPIC Africa is a Horizon Europe consortium of €2,499,675 spanning European and African partners. Work Package 6 covers climate, land, energy and water systems (CLEWS) modelling for the water–energy–food nexus — the integrated framework that forces energy planning, land use and water availability to be solved together rather than sequentially.',
      'The role carries the data analysis for that work package: assembling and interrogating the inputs and outputs that the CLEWS framework consumes and produces, and holding them to a standard where a partner in another country can use them.',
      'It also carries the communications brief across the consortium — partner communications spanning the European and African institutions, which in a distributed modelling consortium is the difference between shared method and parallel effort. The programme is one of two engagements where the technical and communications strands are held in the same post.',
    ],
    outputs: [
      'Work Package 6 CLEWS data analysis',
      'Consortium partner communications across European and African institutions',
    ],
    tags: [
      'CLEWS',
      'Water–energy–food nexus',
      'Horizon Europe',
      'Data analysis',
      'Consortium',
    ],
    featured: true,
  },
  {
    slug: 'ndc-action-e-mobility',
    title: 'NDC Action E-Mobility Policy Working Group',
    practice: 'consulting',
    org: 'UN Environment Programme (UNEP) with Base Foundation',
    role: 'Project Coordinator',
    period: 'Jul 2024 – Apr 2025',
    summary:
      'Coordination of Ghana’s national e-mobility policy working group, holding its outputs to the country’s NDC commitments and building the coalition the later supply-side regulation was founded on.',
    body: [
      'The working group was the national forum for electric mobility policy, and coordinating it meant running the stakeholder process while holding the group’s outputs to Ghana’s Nationally Determined Contribution commitments — keeping a policy conversation tethered to a quantified international obligation.',
      'Technical input covered e-mobility policy, regulation and capacity-building programmes, spanning both vehicle adoption and charging infrastructure, so that the group’s positions rested on something more than preference.',
      'Activity tracking and progress reporting ran alongside advocacy that widened the coalition supporting electric mobility. That coalition is what the zero-emission vehicle supply-side regulation was subsequently built on: by the time a regulatory instrument was drafted, the constituency for it already existed.',
    ],
    tags: [
      'E-mobility',
      'NDCs',
      'Policy coordination',
      'Charging infrastructure',
      'Advocacy',
    ],
  },
  {
    slug: 'solar-powered-irrigation-systems',
    title: 'Solar-Powered Irrigation Systems for Smallholder Farmers',
    practice: 'consulting',
    org: 'German Federal Ministry for Economic Cooperation and Development (BMZ)',
    role: 'Technical Specialist',
    period: '2022 – Dec 2023',
    summary:
      'Technical assessment of decentralised solar irrigation at smallholder scale — system sizing, water source suitability and adoption economics — feeding a national financing instrument.',
    body: [
      'The assessment covered decentralised solar irrigation for smallholder farmers across three dimensions that are usually studied apart: system sizing, water source suitability and the economics of adoption at farm scale. Treating them together is what determines whether a pump that works technically is a pump a farmer will actually buy and run.',
      'The findings fed the Investment Plan for Financing Solar-Powered Irrigation in Ghana, linking a field-level technology assessment directly to a national financing instrument — the step most technology assessments never take.',
    ],
    outputs: [
      'Technical assessment of decentralised solar irrigation at farm scale',
      'Contribution to the Investment Plan for Financing Solar-Powered Irrigation in Ghana',
    ],
    tags: [
      'Solar irrigation',
      'Smallholder agriculture',
      'System sizing',
      'Adoption economics',
      'Investment planning',
    ],
  },
  {
    slug: 'government-goes-solar',
    title: '“Government Goes Solar” Feasibility Study',
    practice: 'consulting',
    org: 'Ministry of Energy, Ghana — funded by KfW',
    role: 'Environmental Specialist',
    period: 'Jan – Jun 2022',
    summary:
      'Environmental Impact Assessment and Environmental and Social Management Plan for a rooftop solar initiative across 57 public facilities.',
    body: [
      'The “Government Goes Solar” initiative put rooftop photovoltaics on public facilities across Ghana. The environmental brief covered the Environmental Impact Assessment for the rooftop solar programme across 57 public facilities — a portfolio assessment rather than a site one, with the variation between facility types doing much of the analytical work.',
      'The Environmental and Social Management Plan that followed governs the identification and mitigation of impacts across the full facility portfolio, giving the Ministry of Energy a single instrument to hold installations to as the programme rolls out.',
    ],
    outputs: [
      'Environmental Impact Assessment across 57 public facilities',
      'Environmental and Social Management Plan for the facility portfolio',
    ],
    tags: [
      'Rooftop solar',
      'Environmental impact assessment',
      'ESMP',
      'Public facilities',
      'KfW',
    ],
  },

  /* ------------------------------------------------------------------ */
  /* AI & Digital Systems                                                */
  /* ------------------------------------------------------------------ */
  {
    slug: 'undp-green-skills-jobs-tracker',
    title: 'UNDP Green Skills and Jobs Tracker',
    practice: 'systems',
    org: 'United Nations Development Programme (UNDP), Ghana',
    role: 'Designer and Developer',
    period: '2025 – Present',
    summary:
      'National platform making green enterprise activity and green employment visible in official data systems, built as an accountability mechanism for Ghana’s NDC 3.0 implementation period.',
    body: [
      'Green jobs are counted badly almost everywhere, because the enterprises that create them do not fit the categories official statistics already have. The tracker exists to make green enterprise activity and green employment visible inside Ghana’s official data systems rather than alongside them.',
      'It is built as an accountability mechanism for the NDC 3.0 implementation period, and structured so that its output feeds the country’s Biennial Transparency Reports to the UNFCCC — which means the data model is designed backwards from a reporting obligation rather than forwards from what is easy to collect.',
    ],
    outputs: [
      'Green Business and Jobs Tracker concept note and design framework, Ghana (UNDP, 2026)',
    ],
    tags: [
      'Green jobs',
      'NDC 3.0',
      'Biennial Transparency Reports',
      'UNFCCC',
      'Data platform',
    ],
  },
  {
    slug: 'plastics-circularity-platform',
    title: 'Plastics Circularity Platform',
    practice: 'systems',
    org: 'Pitched to the International Organization for Migration (IOM)',
    role: 'Designer and Developer',
    period: '2026',
    summary:
      'Digital platform for plastic waste and circular economy value chains in Ghana, pitched to the International Organization for Migration.',
    body: [
      'The platform addresses plastic waste and circular economy value chains in Ghana, where the recovery economy is large, informal and largely unmapped — which is precisely why value chain coordination is where the losses sit.',
      'It was pitched to the International Organization for Migration, whose interest in the sector runs through the livelihoods of the mobile and informal workforce that the waste recovery chain depends on.',
    ],
    tags: [
      'Circular economy',
      'Plastic waste',
      'Value chains',
      'Digital platform',
      'IOM',
    ],
  },
  {
    slug: 'guardian',
    title: 'GUARDIAN — Ghana Unified Referral and Digital Intelligence for Action on Neglect',
    practice: 'systems',
    org: 'UNIYIA — Last-Mile Protection Gap challenge',
    role: 'Designer and Developer',
    period: '2026',
    summary:
      'National child-protection and anti-trafficking coordination platform with multi-channel reporting, geospatial case routing and an inter-agency dashboard. Finalist in the UNICEF StartUp Lab Pitch.',
    body: [
      'Child protection in Ghana does not fail for lack of agencies; it fails at the handoff between them. GUARDIAN is a national child-protection and anti-trafficking coordination platform submitted by UNIYIA under the Last-Mile Protection Gap challenge, and a finalist in the UNICEF StartUp Lab Pitch.',
      'Reporting is multi-channel — USSD, WhatsApp and web — so that a report does not require a smartphone or a data plan. Cases are then routed geospatially to the nearest qualified agency, with severity-based service-level escalation so that the most serious cases cannot sit unclaimed in a queue.',
      'An inter-agency dashboard links CHRAJ, the Department of Children, the Department of Gender, Social Welfare, the Labour Department and the Ghana Police Service — putting the referral trail in one place across bodies that currently keep separate records.',
      'The architecture is offline-first on Next.js 15 with PostgreSQL and PostGIS, a deliberate choice for a system that has to work in the districts where connectivity is worst and the protection gap is widest.',
    ],
    partners: [
      'Commission on Human Rights and Administrative Justice (CHRAJ)',
      'Department of Children',
      'Department of Gender',
      'Department of Social Welfare',
      'Labour Department',
      'Ghana Police Service',
    ],
    tags: [
      'Child protection',
      'Anti-trafficking',
      'Next.js 15',
      'PostgreSQL',
      'PostGIS',
      'USSD',
      'Offline-first',
      'Geospatial routing',
    ],
    featured: true,
  },
  {
    slug: 'climaschool-ai',
    title: 'ClimaSchool AI',
    practice: 'systems',
    org: 'Independent',
    role: 'Designer and Developer',
    period: '2025 – Present',
    summary:
      'Platform converting live climate, air-quality and disease-surveillance data into multilingual child-health advisories in English, Twi, Hausa and Ga. Shortlisted to apply for a USD 100,000 grant.',
    body: [
      'Climate risk reaches children through air quality and disease before it reaches them through anything else, and the data for both already exists — just not in a form a school or a parent can act on.',
      'ClimaSchool AI converts live climate, air-quality and disease-surveillance feeds into child-health advisories, published in English, Twi, Hausa and Ga. The multilingual requirement is structural rather than cosmetic: an advisory that arrives only in English reaches the wrong half of the affected population.',
      'The platform has been shortlisted to apply for a USD 100,000 grant.',
    ],
    tags: [
      'Climate and health',
      'Air quality',
      'Disease surveillance',
      'Multilingual',
      'Advisory systems',
    ],
    href: 'https://github.com/romeokoduah/climaschool-ai',
    featured: true,
  },
  {
    slug: 'nwa-tracker',
    title: 'National Water Accounting (NWA) Tracker',
    practice: 'systems',
    org: 'International Water Management Institute',
    role: 'Designer and Developer',
    period: '2025 – 2026',
    summary:
      'Production dashboard tracking national water accounting maturity across 43 sub-Saharan African countries, on a React and TypeScript front end with a serverless Postgres backend.',
    body: [
      'National water accounting maturity varies enormously across sub-Saharan Africa, and until it is measured comparably there is no way to target support where it changes anything. The tracker covers 43 countries in a single production dashboard.',
      'The front end is React and TypeScript; the backend is serverless Postgres. It is a production system rather than a prototype — built to be maintained by the institution that depends on the numbers, and used against live country assessments.',
    ],
    tags: [
      'Water accounting',
      'React',
      'TypeScript',
      'Serverless Postgres',
      'Dashboard',
      'Sub-Saharan Africa',
    ],
    href: 'https://github.com/romeokoduah/nwa-tracker',
  },
  {
    slug: 'xtensiontab',
    title: 'XtensionTab — Debate Tournament Suite',
    practice: 'systems',
    org: 'Independent',
    role: 'Designer and Developer',
    period: '2024 – Present',
    summary:
      'End-to-end British Parliamentary tournament suite with conflict-aware adjudicator allocation, tabulation, blind rounds, mobile e-ballots and live broadcast of draws and standings.',
    body: [
      'Running a British Parliamentary tournament is a constrained allocation problem disguised as an administrative one: adjudicators must be assigned to rooms without conflicts of interest, in strength order, against a draw that changes every round.',
      'XtensionTab handles the whole tournament end to end — conflict-aware adjudicator allocation, tabulation, blind rounds, round-robin mode, mobile e-ballots, and live broadcast of draws and standings. It is used to run competitive rounds on the Ghanaian circuit.',
      'The platform comes directly out of the debate practice: a coach and accredited adjudicator building the tooling for the format they compete and judge in.',
    ],
    tags: [
      'Tournament software',
      'British Parliamentary debate',
      'Allocation',
      'E-ballots',
      'Live broadcast',
    ],
  },
  {
    slug: 'uenr-alumni-career-hub',
    title: 'UENR Alumni Career Hub',
    practice: 'systems',
    org: 'University of Energy and Natural Resources',
    role: 'Designer and Developer',
    period: '2024 – Present',
    summary:
      'Career-services platform with an AI assistant, automated CV review and an AI mock interviewer, built for the UENR alumni network.',
    body: [
      'The Alumni Career Hub is a career-services platform for the UENR alumni network, built around three capabilities that a small careers office cannot staff at scale: an AI assistant, automated CV review and an AI mock interviewer.',
      'It connects directly to the alumni network work carried out as Head of Communications and Knowledge Management at RCEES — the platform is the durable form of a network that otherwise exists only as a contact list.',
    ],
    tags: [
      'Career services',
      'AI assistant',
      'CV review',
      'Mock interview',
      'Alumni network',
    ],
    href: 'https://github.com/romeokoduah/UENR-AlumniCareerHub',
  },
  {
    slug: 'culturesphere',
    title: 'Culturesphere',
    practice: 'systems',
    org: 'AI Party ATOX Hackathon',
    role: 'Designer and Developer',
    period: '2026',
    summary:
      'Cultural heritage platform pitched at the AI Party ATOX Hackathon, where it won the Global Impact Award.',
    body: [
      'Culturesphere was built and pitched at the AI Party ATOX Hackathon, where it won the Global Impact Award.',
      'It sits slightly apart from the water and energy portfolio, and deliberately so: the same systems practice — data, access and a working front end — applied to cultural heritage.',
    ],
    tags: ['Cultural heritage', 'Hackathon', 'Award-winning', 'Web platform'],
    href: 'https://github.com/romeokoduah/CulturalHeritage',
  },

  /* ------------------------------------------------------------------ */
  /* Communications & Knowledge Management                               */
  /* ------------------------------------------------------------------ */
  {
    slug: 'rcees-knowledge-management',
    title: 'Knowledge Management for a World Bank Africa Centre of Excellence',
    practice: 'communications',
    org: 'Regional Centre for Energy and Environmental Sustainability (RCEES), University of Energy and Natural Resources',
    role: 'Head of Communications and Knowledge Management',
    period: 'Jan 2024 – Present',
    summary:
      'Knowledge management for a World Bank Africa Centre of Excellence — curating research outputs, building the alumni network, and producing institutional and donor-facing reports.',
    body: [
      'A Centre of Excellence produces more knowledge than it can retain, and the loss happens at the point where a project ends and its outputs disperse. The knowledge management function exists to stop that: curating research outputs, building the alumni network, and producing the institutional and donor-facing reports through which the Centre accounts for itself to the World Bank.',
      'The post also acts as institutional liaison between the Centre and government agencies, universities, industry partners and international collaborators — the standing relationship layer that individual projects borrow from rather than rebuild each time.',
      'Representation at national policy forums forms the outward-facing half of the role, including UNDP Renewable Energy Master Plan consultations, Ghana’s National EV Policy consultation, and the World Bank Africa Centres of Excellence policy meeting. Carrying a Centre’s technical position into a national consultation is where knowledge management stops being an archive function.',
    ],
    outputs: [
      'Institutional and donor-facing reports for the World Bank Africa Centre of Excellence',
      'Curated research output and alumni network',
      'Representation at UNDP Renewable Energy Master Plan consultations',
      'Representation at Ghana’s National EV Policy consultation',
      'Representation at the World Bank Africa Centres of Excellence policy meeting',
    ],
    partners: [
      'World Bank Africa Centres of Excellence',
      'Government agencies',
      'Universities and industry partners',
      'International collaborators',
    ],
    tags: [
      'Knowledge management',
      'Donor reporting',
      'Institutional liaison',
      'Policy forums',
      'Alumni network',
    ],
    featured: true,
  },
  {
    slug: 'proreg-renewable-energy-education',
    title: 'ProREG — Promoting Renewable Energy through Graduate Education',
    practice: 'communications',
    org: 'DAAD via TU Berlin',
    role: 'Senior Technical Officer and Project Communications Specialist',
    period: 'Oct 2022 – Dec 2025',
    funding: 'USD 614,177',
    summary:
      'Communications portfolio and technical support for a USD 614,177 DAAD programme embedding practice-relevant renewable energy modules into UENR’s graduate curricula.',
    body: [
      'ProREG targets a specific gap: what renewable energy graduates are taught versus what the labour market in the energy transition actually demands. The programme, funded through DAAD via TU Berlin at USD 614,177, supported the integration of practice-relevant renewable energy modules into UENR’s curricula.',
      'The role managed the project’s communications portfolio and its external visibility across the German–Ghanaian academic and policy network — a bilateral programme whose value depends on both sides seeing what the other is producing.',
      'Alongside the communications brief sat a technical one: contributions to lecturer capacity building and the facilitation of knowledge exchange through an international network of renewable energy experts. As with EPIC Africa, the technical and communications strands were held in the same post rather than split between two.',
    ],
    outputs: [
      'Practice-relevant renewable energy modules integrated into UENR curricula',
      'Project communications portfolio and external visibility programme',
      'Lecturer capacity building and expert knowledge exchange',
    ],
    partners: [
      'DAAD',
      'Technische Universität Berlin',
      'University of Energy and Natural Resources',
    ],
    tags: [
      'Renewable energy education',
      'Curriculum development',
      'Communications',
      'Capacity building',
      'German–Ghanaian cooperation',
    ],
  },
  {
    slug: 'ndc-action-climate-smart-agriculture',
    title: 'NDC Action Climate-Smart Agriculture',
    practice: 'communications',
    org: 'UN Environment Programme (UNEP), NDC Action Ghana',
    role: 'Environment and Communications Expert',
    period: 'Jul 2023 – Aug 2024',
    funding: 'USD 134,000',
    summary:
      'Environmental analysis and communication strategy for climate-smart agriculture planning at farm and district level, feeding Ghana’s solar irrigation investment plan.',
    body: [
      'The post integrated environmental analysis into agricultural planning, strengthening the sustainability of project interventions at farm and district level — the two scales at which climate-smart agriculture either works or is a slogan.',
      'The communications half designed strategies and content that raised project visibility and carried findings into community outreach, so that the analysis reached the farming communities it described rather than only the agencies that commissioned it.',
      'Work with stakeholders and farming communities ensured environmental concerns were reflected in project design, and the engagement contributed to the Investment Plan for Financing Solar-Powered Irrigation in Ghana (2025).',
    ],
    outputs: [
      'Environmental analysis integrated into farm and district agricultural planning',
      'Communication strategy and community outreach content',
      'Contribution to the Investment Plan for Financing Solar-Powered Irrigation in Ghana (2025)',
    ],
    tags: [
      'Climate-smart agriculture',
      'NDCs',
      'Community outreach',
      'Environmental analysis',
      'Investment planning',
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Training, Facilitation & Speaking                                   */
  /* ------------------------------------------------------------------ */
  {
    slug: 'sdg-651-facilitation',
    title: 'SDG Indicator 6.5.1 Facilitation',
    practice: 'speaking',
    org: 'Cap-Net / Global Water Partnership / UNEP-DHI',
    role: 'Certified Facilitator',
    period: '2023 – Present',
    summary:
      'Certified facilitator on the Cap-Net, Global Water Partnership and UNEP-DHI Training of Facilitators for SDG indicator 6.5.1 — the degree of integrated water resources management implementation.',
    body: [
      'SDG indicator 6.5.1 measures the degree of integrated water resources management implementation, and it is reported by countries themselves through a structured national process. Whoever facilitates that process shapes the number.',
      'Certification came through the Cap-Net, Global Water Partnership and UNEP-DHI Training of Facilitators, the accreditation route for running national 6.5.1 assessments. It sits directly alongside the water accounting work: the indicator asks what a country has implemented, and the accounting asks what its water is actually doing.',
    ],
    tags: [
      'SDG 6.5.1',
      'Integrated water resources management',
      'Facilitation',
      'Cap-Net',
      'UNEP-DHI',
    ],
  },
  {
    slug: 'water-accounting-workshops',
    title: 'Water Accounting Plus and VegET Workshops',
    practice: 'speaking',
    org: 'International Water Management Institute',
    role: 'Facilitator',
    period: '2025 – Present',
    summary:
      'Facilitation of Water Accounting Plus (WA+) and VegET water-accounting workshops in Ghana and Ethiopia, and Small Reservoirs Dashboard training in Accra.',
    body: [
      'Water accounting only works if the people running national assessments can run the models themselves. The workshops carry WA+ and VegET methods to national teams in Ghana and Ethiopia, moving the modelling capability to where the data and the decisions are.',
      'Small Reservoirs Dashboard training in Accra covers the same ground from the operational side — small reservoirs being the water infrastructure that matters most to rural livelihoods and is monitored least.',
      'The facilitation runs directly out of the modelling practice: the same VegET and mizuRoute chain used in the DIWASA continental runs is what the workshops teach.',
    ],
    tags: [
      'Water Accounting Plus',
      'VegET',
      'Capacity building',
      'Ghana',
      'Ethiopia',
      'Small reservoirs',
    ],
  },
  {
    slug: 'ecowas-webinar-series',
    title: 'ECOWAS Sub-Regional Webinar Series on Electric Mobility Regulation',
    practice: 'speaking',
    org: 'UNEP / ClimateWorks Foundation with ECOWAS member states',
    role: 'Designer and Lead Facilitator',
    period: '2025 – 2026',
    summary:
      'Design and delivery of the ECOWAS sub-regional webinar series on supply-side regulation for electric mobility, reaching 51 stakeholders across 9 countries.',
    body: [
      'The webinar series was designed and delivered to carry Ghana’s supply-side regulatory work outward, reaching 51 stakeholders across 9 ECOWAS countries. Vehicle import markets in West Africa are interconnected, so a standard set in one country changes the flow into its neighbours whether or not they participated in setting it.',
      'The series turned a national instrument into a regional policy conversation, and served as the dissemination arm of the UNEP and ClimateWorks zero-emission vehicle supply-side regulation programme.',
    ],
    tags: [
      'ECOWAS',
      'Electric mobility',
      'Webinar series',
      'Regional policy',
      'Dissemination',
    ],
  },
  {
    slug: 'lcoy-ghana-2025',
    title: 'Local Conference of Youth (LCOY) Ghana 2025',
    practice: 'speaking',
    org: 'UNFCCC / YOUNGO',
    role: 'Conference Manager',
    period: 'Sep 2025',
    summary:
      'Conference Manager for Ghana’s official youth climate conference, coordinating planning and delivery for over 500 registered young leaders, civil society groups and policymakers feeding into the UNFCCC process.',
    body: [
      'LCOY Ghana is the country’s official youth climate conference under the UNFCCC and YOUNGO, and its outputs feed formally into the UNFCCC process rather than stopping at a communiqué.',
      'As Conference Manager the role covered planning and delivery for over 500 registered young leaders, civil society groups and policymakers — a convening whose scale is the point, because the legitimacy of a national youth statement depends on how many people it genuinely passed through.',
      'The convening connects to the Ghana Youth Climate Action Roadmap (GYCAR) 2025–2030 and the National Youth Climate Statement, both of which sit in the policy and technical report record.',
    ],
    outputs: [
      'Ghana Youth Climate Action Roadmap (GYCAR) 2025–2030 — lead author',
      'National Youth Climate Statement, Ghana (2025)',
    ],
    tags: [
      'UNFCCC',
      'YOUNGO',
      'Youth climate',
      'Conference management',
      'National convening',
    ],
    featured: true,
  },
  {
    slug: 'tsinghua-global-youth-dialogue',
    title: 'Fourth Tsinghua Global Youth Dialogue',
    practice: 'speaking',
    org: 'Tsinghua University, China',
    role: 'Delegate and Speaker',
    period: 'Jun – Jul 2026',
    summary:
      'Selected as one of 120 delegates from 5,162 applicants; presented on supply-side determinants of Africa’s electric vehicle transition across programme sites in Hangzhou, Shanghai and Beijing.',
    body: [
      'Selection to the Fourth Tsinghua Global Youth Dialogue came under the theme “Bridging the Divides through Innovation”, as one of 120 delegates drawn from 5,162 applicants.',
      'The presentation covered supply-side determinants of Africa’s electric vehicle transition, delivered across programme sites in Hangzhou, Shanghai and Beijing — putting the Ghanaian supply-side regulatory work in front of an audience in the manufacturing economy that supplies the vehicles it governs.',
    ],
    tags: [
      'Electric vehicles',
      'Supply-side policy',
      'International dialogue',
      'China',
      'Youth delegation',
    ],
  },
  {
    slug: 'graduate-students-association',
    title: 'Graduate Students Association and University Governing Council',
    practice: 'speaking',
    org: 'University of Energy and Natural Resources',
    role: 'President; Student Representative, University Governing Council',
    period: 'Postgraduate study at UENR',
    summary:
      'Elected to lead the graduate student body and, by virtue of the office, sat on the University Governing Council — the institution’s highest decision-making organ.',
    body: [
      'Election to the presidency of the Graduate Students Association carried a seat on the University Governing Council, the institution’s highest decision-making organ. That meant carrying graduate student positions into deliberations on academic policy, fees, welfare and infrastructure, alongside senior management and external members.',
      'The association’s position was built through consultation across faculties and represented directly to management — converting scattered grievances into a small number of arguable, evidence-backed asks. A council table rewards a short list that survives interrogation far more than a long list of complaints.',
    ],
    tags: [
      'Student leadership',
      'University governance',
      'Representation',
      'Advocacy',
    ],
  },
  {
    slug: 'ghana-think-foundation',
    title: 'Ghana Think Foundation — Barcamp Sunyani',
    practice: 'speaking',
    org: 'Ghana Think Foundation, Bono Region',
    role: 'Coordinator; Mentorship Coordinator, Barcamp Sunyani',
    period: 'Oct 2020 – Present',
    summary:
      'Coordination of Barcamp Sunyani and mentorship of young people on education and career pathways, including 20 radio outreaches on volunteerism as a tool for nation-building.',
    body: [
      'Barcamp Sunyani is the Bono Region edition of Ghana Think Foundation’s national unconference network, and coordinating it means building the mentorship pipeline that gives a one-day convening an afterlife.',
      'The work includes mentoring young people on education and career pathways, leading 20 radio outreaches on volunteerism as a tool for nation-building, and facilitating mentoring sessions for the National Science and Maths Quiz.',
    ],
    tags: [
      'Mentorship',
      'Barcamp',
      'Youth development',
      'Radio outreach',
      'Bono Region',
    ],
  },
  {
    slug: 'junior-camp-ghana',
    title: 'Junior Camp Ghana',
    practice: 'speaking',
    org: 'Junior Camp Ghana',
    role: 'Mentor',
    period: '2021 – Present',
    summary:
      'Mentoring senior high school students through transitions into tertiary education and vocational pathways.',
    body: [
      'Junior Camp Ghana works at the transition point where senior high school students choose between tertiary education and vocational pathways — the decision that most determines what follows, and the one made with the least information.',
      'The mentoring role guides students through that transition, complementing the Barcamp Sunyani mentorship work at a younger stage of the same pipeline.',
    ],
    tags: ['Mentorship', 'Secondary education', 'Career pathways', 'Youth'],
  },
  {
    slug: 'debate-coaching-and-adjudication',
    title: 'Debate Coaching and Adjudication',
    practice: 'speaking',
    org: 'Ghana Universities Debate Association and the British Parliamentary circuit',
    role: 'Coach and Accredited Adjudicator',
    period: '2019 – Present',
    summary:
      'Coach and accredited adjudicator across Ghanaian university tournaments, with national championship results, two international coaching awards, and competition at African and World University Debating Championships.',
    body: [
      'Coaching and adjudication run across Ghanaian university tournaments on the British Parliamentary circuit, with national championship results and two international coaching awards to date.',
      'Competition at the African and World University Debating Championships sits alongside the coaching, and the practice produced its own tooling: XtensionTab, the tournament suite used to run competitive rounds.',
      'The habit the format enforces — construct the strongest version of a position under time pressure, then survive contact with the strongest objection to it — is the same one the policy and stakeholder work depends on.',
    ],
    tags: [
      'Debate',
      'Coaching',
      'Adjudication',
      'British Parliamentary',
      'Public speaking',
    ],
  },
] as const satisfies readonly Project[]

export type ProjectSlug = (typeof PROJECTS)[number]['slug']

/** All projects belonging to a practice, in source order. */
export function projectsByPractice(practice: Practice): readonly Project[] {
  return PROJECTS.filter((p) => p.practice === practice)
}

/** Projects flagged for the homepage. */
export const FEATURED_PROJECTS: readonly Project[] = PROJECTS.filter(
  (p) => 'featured' in p && p.featured === true,
)

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}
