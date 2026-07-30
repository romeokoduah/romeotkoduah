# Adding photos to the site

Every project has a folder named after its **slug**. Drop images in, rebuild,
and the site picks them up — no code changes needed.

## How it works

```
public/images/projects/<slug>/
  cover.jpg     <- the card image and the detail-page hero
  01.jpg        <- gallery, in filename order
  02.jpg
  ...
```

- **cover** — name it exactly `cover` (`.jpg`, `.png`, `.webp` and `.avif` all
  work). Landscape, ideally 1600×1000 or wider. Until you add one the card
  shows a typographic tile in the practice colour, so nothing looks broken.
- **gallery** — any other image in the folder. Numbered names (`01`, `02`) keep
  them in the order you want.
- **portrait** — put a photo of yourself at `public/images/portrait.jpg`
  (portrait orientation, ~1200×1800). It replaces the practice index in the
  homepage hero and appears on the About page.
- **backgrounds** — anything in `public/images/backgrounds/` is available to sit
  behind translucent section cards, the way the reference site uses its
  botanical photographs.

Images are served as-is — Next.js optimisation is off for static export, so
**compress before committing.** Aim for under 300 KB per image; `.webp` is a
good default.

## After adding images

```powershell
npm run build      # regenerates the manifest, then builds
./deploy.ps1       # ships it to the server
```

`npm run manifest` alone just regenerates the manifest if you want to check
what was picked up.

## Project folders


### Research & Hydrology (8)

| Project | Folder |
|---|---|
| Water Data Science for Action | `public/images/projects/iwmi-water-data-science/` |
| Lerma–Santiago Basin Discharge and Environmental Flows | `public/images/projects/lerma-santiago-mexico/` |
| DIWASA — Continental Hydrology and Discharge Modelling V2 | `public/images/projects/diwasa-continental-hydrology/` |
| Basin Water Budgets and Small Hydropower Suitability | `public/images/projects/rcees-water-budgets-and-hydropower/` |
| SUSTAINDAM — Hydropower and Climate Change in West Africa | `public/images/projects/sustaindam-hydropower-climate/` |
| Small Hydropower Assessment — Western Rivers of Ghana | `public/images/projects/aqua-equity-small-hydropower/` |
| Earth Observation for Water Budgets — White Volta River Basin | `public/images/projects/white-volta-water-budgets/` |
| Teaching and Research Assistantship | `public/images/projects/rcees-teaching-research-assistantship/` |

### Policy & Consulting (7)

| Project | Folder |
|---|---|
| Ghana Zero-Emission Vehicle Supply-Side Regulation | `public/images/projects/zev-supply-side-regulation/` |
| Article 6.2 Cookstove Carbon Programme | `public/images/projects/article-6-2-cookstove-carbon/` |
| Moving IMPACT — Solar Mini-Grids and EV Charging | `public/images/projects/moving-impact/` |
| EPIC Africa — CLEWS Modelling for the Water–Energy–Food Nexus | `public/images/projects/epic-africa-clews/` |
| NDC Action E-Mobility Policy Working Group | `public/images/projects/ndc-action-e-mobility/` |
| Solar-Powered Irrigation Systems for Smallholder Farmers | `public/images/projects/solar-powered-irrigation-systems/` |
| “Government Goes Solar” Feasibility Study | `public/images/projects/government-goes-solar/` |

### AI & Digital Systems (8)

| Project | Folder |
|---|---|
| UNDP Green Skills and Jobs Tracker | `public/images/projects/undp-green-skills-jobs-tracker/` |
| Plastics Circularity Platform | `public/images/projects/plastics-circularity-platform/` |
| GUARDIAN — Ghana Unified Referral and Digital Intelligence for Action on Neglect | `public/images/projects/guardian/` |
| ClimaSchool AI | `public/images/projects/climaschool-ai/` |
| National Water Accounting (NWA) Tracker | `public/images/projects/nwa-tracker/` |
| XtensionTab — Debate Tournament Suite | `public/images/projects/xtensiontab/` |
| UENR Alumni Career Hub | `public/images/projects/uenr-alumni-career-hub/` |
| Culturesphere | `public/images/projects/culturesphere/` |

### Communications & Knowledge Management (3)

| Project | Folder |
|---|---|
| Knowledge Management for a World Bank Africa Centre of Excellence | `public/images/projects/rcees-knowledge-management/` |
| ProREG — Promoting Renewable Energy through Graduate Education | `public/images/projects/proreg-renewable-energy-education/` |
| NDC Action Climate-Smart Agriculture | `public/images/projects/ndc-action-climate-smart-agriculture/` |

### Training, Facilitation & Speaking (9)

| Project | Folder |
|---|---|
| SDG Indicator 6.5.1 Facilitation | `public/images/projects/sdg-651-facilitation/` |
| Water Accounting Plus and VegET Workshops | `public/images/projects/water-accounting-workshops/` |
| ECOWAS Sub-Regional Webinar Series on Electric Mobility Regulation | `public/images/projects/ecowas-webinar-series/` |
| Local Conference of Youth (LCOY) Ghana 2025 | `public/images/projects/lcoy-ghana-2025/` |
| Fourth Tsinghua Global Youth Dialogue | `public/images/projects/tsinghua-global-youth-dialogue/` |
| Graduate Students Association and University Governing Council | `public/images/projects/graduate-students-association/` |
| Ghana Think Foundation — Barcamp Sunyani | `public/images/projects/ghana-think-foundation/` |
| Junior Camp Ghana | `public/images/projects/junior-camp-ghana/` |
| Debate Coaching and Adjudication | `public/images/projects/debate-coaching-and-adjudication/` |
