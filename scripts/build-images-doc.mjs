/**
 * Regenerates IMAGES.md — the guide listing which folder each project's photos
 * belong in. Run after adding or renaming a project: `node scripts/build-images-doc.mjs`
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = readFileSync(join(root, 'content', 'projects.ts'), 'utf8')

const RE =
  /slug:\s*'([^']+)',\s*\n\s*title:\s*'((?:[^'\\]|\\.)*)',\s*\n\s*practice:\s*'([^']+)'/g

const rows = []
for (const m of src.matchAll(RE)) {
  rows.push({ slug: m[1], title: m[2].replace(/\\'/g, "'"), practice: m[3] })
}

const NAMES = {
  research: 'Research & Hydrology',
  consulting: 'Policy & Consulting',
  systems: 'AI & Digital Systems',
  communications: 'Communications & Knowledge Management',
  speaking: 'Training, Facilitation & Speaking',
}
const ORDER = ['research', 'consulting', 'systems', 'communications', 'speaking']

let out = `# Adding photos to the site

Every project has a folder named after its **slug**. Drop images in, rebuild,
and the site picks them up — no code changes needed.

## How it works

\`\`\`
public/images/projects/<slug>/
  cover.jpg     <- the card image and the detail-page hero
  01.jpg        <- gallery, in filename order
  02.jpg
  ...
\`\`\`

- **cover** — name it exactly \`cover\` (\`.jpg\`, \`.png\`, \`.webp\` and \`.avif\` all
  work). Landscape, ideally 1600×1000 or wider. Until you add one the card
  shows a typographic tile in the practice colour, so nothing looks broken.
- **gallery** — any other image in the folder. Numbered names (\`01\`, \`02\`) keep
  them in the order you want.
- **portrait** — put a photo of yourself at \`public/images/portrait.jpg\`
  (portrait orientation, ~1200×1800). It replaces the practice index in the
  homepage hero and appears on the About page.
- **backgrounds** — anything in \`public/images/backgrounds/\` is available to sit
  behind translucent section cards, the way the reference site uses its
  botanical photographs.

Images are served as-is — Next.js optimisation is off for static export, so
**compress before committing.** Aim for under 300 KB per image; \`.webp\` is a
good default.

## Institution logos

Where no photo exists, a card shows the commissioning institution's logo
instead of a monogram. Logos live in \`public/images/logos/<key>.<ext>\` and
\`content/logos.ts\` maps each project slug to an ordered list of keys — the
first key with a file present wins, so a project can fall back from a centre to
its parent university, and finally to the monogram.

To add or change one: drop the file in \`public/images/logos/\`, then point the
slug at it in \`content/logos.ts\`. The build validates the actual bytes and
silently skips anything that is not a real image, so a bad download can never
reach a live page.

A photo always beats a logo, and a logo always beats a monogram — so adding
\`cover.jpg\` to a project folder takes over from its logo automatically.

## After adding images

\`\`\`powershell
npm run build      # regenerates the manifest, then builds
./deploy.ps1       # ships it to the server
\`\`\`

\`npm run manifest\` alone just regenerates the manifest if you want to check
what was picked up.

## Project folders

`

for (const key of ORDER) {
  const list = rows.filter((r) => r.practice === key)
  out += `\n### ${NAMES[key]} (${list.length})\n\n| Project | Folder |\n|---|---|\n`
  for (const r of list) {
    out += `| ${r.title} | \`public/images/projects/${r.slug}/\` |\n`
  }
}

writeFileSync(join(root, 'IMAGES.md'), out, 'utf8')
console.log(`IMAGES.md written — ${rows.length} projects`)
