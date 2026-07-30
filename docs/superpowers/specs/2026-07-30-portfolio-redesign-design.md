# Portfolio Redesign — romeotkoduah.org

**Date:** 2026-07-30
**Owner:** Romeo Tweneboah Koduah
**Status:** Approved for implementation

## Goal

Replace the placeholder single-file `index.html` with a production portfolio for
`romeotkoduah.org`, built in the visual language of theacademicdesigner.com but
carrying Romeo's own content and a practice-based menu rather than a services menu.

Content source: `F:\CV\Canada\Romeo_Tweneboah_Koduah_CV_PhD_Application_Final.docx`.

## Positioning

The spine of the site: **water, energy and climate systems — measured, modelled,
and turned into policy, communication and software.**

Five practices, in this order:

1. **Research & Hydrology** — IWMI, DIWASA, Lerma–Santiago, White Volta water budgets, SUSTAINDAM, publications
2. **Policy & Consulting** — UNEP ZEV supply-side regulation, Article 6.2 carbon, EPIC Africa, Imperial/UKRI, Ministry of Energy
3. **AI & Digital Systems** — GUARDIAN, ClimaSchool AI, NWA Tracker, UNDP Green Jobs Tracker, XtensionTab, Alumni Hub, Culturesphere
4. **Communications & Knowledge Management** — RCEES Head of Comms, EPIC Africa, ProREG, NDC Action, stakeholder engagement
5. **Training, Facilitation & Speaking** — Cap-Net SDG 6.5.1, ECOWAS webinar series, LCOY Ghana, debate coaching, mentorship

Each practice owns an accent colour, mirroring the reference site's
per-section colour-coding.

## Visual language

Derived from theacademicdesigner.com. The reference is WordPress/Assembler with
no framework and no animation library; its character comes entirely from type,
colour blocking and photographic backgrounds.

### Typography

| Role | Family | Weight |
|---|---|---|
| Headings, site title | **Oswald** | 500 |
| Body, nav, buttons | **Open Sans** | 400 / 600 nav / 700 buttons |

Both are free Google Fonts, self-hosted via `next/font/google`.

Critical ratio: **headings at `line-height: 1`, body at `1.5`.** No serif,
no `text-transform: uppercase`, no `letter-spacing` anywhere — Oswald's
condensed forms do that work.

Fluid scale (as shipped by the reference):

| Element | @320px | @1200px+ | line-height |
|---|---|---|---|
| h1 | 37.8px | 70px | 1 |
| h2 | 31.6px | 56px | 1 |
| h3 | 21px | 34px | 1.2 |
| body | 14px | 18px | 1.5 |

### Colour

```
--bg            #ffffff    page white
--bg-soft       #f8f6f6    dominant section background (~70% of the page)
--ink           #000000    body text, footer slab
--green-deep    #0b472c    masthead band, outline buttons   → Research
--rust          #a4400a    primary button fill, hero h1     → Policy & Consulting
--indigo        #4458be    editorial zone                   → AI & Systems
--orange        #c14300    link hover                       → Communications
--green         #158753    borders, labels                  → Speaking & Training
--periwinkle    #b2bbe6    secondary outline borders
--card-white    #ffffffd9  translucent card over photography
--card-warm     #f7f5f58f  translucent card over photography
```

### Layout

- Content measure **740px**, wide container **1200px**.
- Spacing scale: `--s20: min(25px,5vw)` … `--s80: min(175px,17.5vw)`.
- Section rhythm: `--s20` inside cards → `--s30` between blocks → `--s60`/`--s70` between sections.
- Full-bleed sections wrapping a 1200px inner. No offset, overlap, or bleed-off-canvas.
- **Flat** — no shadows. Separation comes from colour blocks and 2px borders.
- Buttons: `border-radius: 0`, `padding: 16px 24px`, Open Sans 700, outline variant `2px solid` at `padding: 15px 23px`. Shipped in rows of 2–3.

### Deliberate divergences from the reference

- **Photography** — their succulent backgrounds become Romeo's project and
  fieldwork photography behind the same translucent cards.
- **Motion** — the reference has none, which reads dated. Add restrained MagicUI:
  `BlurFade` scroll reveals, a slow edge-masked `Marquee` for partner
  organisations, `NumberTicker` for the stats strip, `ScrollProgress` as a
  hairline rule. No neon, no beams, no glow.
- **Sticky nav** — the reference masthead scrolls away. Ours condenses to a
  slim sticky bar after the hero.
- **Practice menu**, not a services menu.

### Reference bugs not to reproduce

`#0000ee` default link colour; the inverted `h4` clamp (min > max); the
`#157853`/`#158753` split; mixed `3px`/`4px` card radii.

## Architecture

**Stack:** Next.js 15 (App Router) + Tailwind v4 + MagicUI (shadcn registry) +
`motion`. `output: 'export'` → static HTML/CSS/JS → nginx.

Static export is required: the VPS runs ~10 other sites and has ~290 MB RAM
free, so builds happen locally and only the artifact ships.

### Routes

```
/                          Home
/about                     Bio, education, awards, certifications, memberships
/research                  Practice page
/consulting                Practice page
/systems                   Practice page
/communications            Practice page
/speaking                  Practice page
/publications              Journal articles, manuscripts under review, reports
/work/[slug]               Project detail page (one per project, ~28)
/contact                   Email + LinkedIn + GitHub
```

Nav: `Romeo T. Koduah` · About · Research · Consulting · Systems ·
Communications · Speaking · Contact.

### Content model

All content is typed data in `content/`, not MDX — it comes from a CV, so
it is structured records, not prose documents.

```ts
// content/projects.ts
type Practice = 'research' | 'consulting' | 'systems' | 'communications' | 'speaking'

interface Project {
  slug: string              // stable; also the image folder name
  title: string
  practice: Practice
  org: string               // IWMI, UNEP, EU Horizon Europe…
  role: string
  period: string
  funding?: string          // "€2,499,675", "USD 614,177"
  summary: string           // 1–2 sentences, card copy
  body: string[]            // paragraphs, detail page
  outputs?: string[]        // reports, dashboards, publications
  partners?: string[]
  tags: string[]
  href?: string             // live URL or GitHub repo
  featured?: boolean
}
```

Also: `profile.ts`, `publications.ts`, `education.ts`, `awards.ts`,
`certifications.ts`, `memberships.ts`, `speaking.ts`, `skills.ts`.

### Image plan

Images live at `public/images/projects/<slug>/`:

- `cover.jpg` — picked up automatically by the card and detail hero
- `01.jpg`, `02.jpg`, … — become the detail-page gallery

A build-time manifest script scans `public/images/projects/` and emits
`content/image-manifest.json`, so no code changes are needed when Romeo drops
in new photos — just rebuild. Where no cover exists, the card renders a
typographic fallback tile in the practice's accent colour, so the site looks
finished from day one.

`IMAGES.md` at the repo root lists every slug and its folder path.

### Privacy

Excluded from the public site, per owner decision:

- Phone number `+233 55 498 1410`
- Postal address (P.O. Box 214, Sunyani)
- **All three referees** — names, institutional emails and phone numbers.
  Publishing third parties' contact details without their consent is not
  something to do by default.

Published: email, LinkedIn, GitHub.

## Deployment

Target: `romeotkoduah.org` (+ `www`), already resolving to `169.58.42.182`
via Namecheap nameservers (`dns1/dns2.registrar-servers.com`). Verified
2026-07-30; no nginx server block exists for it yet, so the domain currently
404s and nothing will be clobbered.

1. `npm run build` locally → `out/`
2. tar → scp → extract to `/var/www/romeotkoduah.org`
3. New nginx server block for `romeotkoduah.org` + `www.romeotkoduah.org`
4. `certbot --nginx` for HTTPS, with HTTP→HTTPS redirect
5. `deploy.ps1` rewritten for one-command redeploys

The existing ten server blocks (alvatechlab, carlab, cleen, cleenglobal,
crontract, eclipsemotors, groupeania, lms/qfc.groupeania.com, xtension) are
not touched.

Source pushes to `github.com/romeokoduah/romeotkoduah` (existing `origin`).

## Out of scope

- CMS or admin UI — content is edited in `content/*.ts` and committed.
- Blog. Add later if wanted; the route structure leaves room.
- Analytics, contact form backend. Contact is a `mailto:` link for now.
- Dark mode. The reference has none and the warm-paper palette doesn't want one.
