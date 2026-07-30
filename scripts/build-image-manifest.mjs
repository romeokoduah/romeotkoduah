/**
 * Scans public/images/projects/<slug>/ and emits content/image-manifest.json.
 *
 * Drop photos into the folder named after a project slug and rebuild — no code
 * changes needed. `cover.*` becomes the card image and detail hero; any other
 * image becomes part of the detail-page gallery, sorted by filename.
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, dirname, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const projectsDir = join(root, 'public', 'images', 'projects')
const outFile = join(root, 'content', 'image-manifest.json')

const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'])

/** @type {Record<string, { cover: string | null, gallery: string[] }>} */
const manifest = {}

if (existsSync(projectsDir)) {
  for (const slug of readdirSync(projectsDir)) {
    const dir = join(projectsDir, slug)
    if (!statSync(dir).isDirectory()) continue

    const files = readdirSync(dir)
      .filter((f) => EXTS.has(extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))

    if (files.length === 0) continue

    const coverFile = files.find((f) => basename(f, extname(f)).toLowerCase() === 'cover')
    const gallery = files.filter((f) => f !== coverFile)

    manifest[slug] = {
      cover: coverFile ? `/images/projects/${slug}/${coverFile}` : null,
      gallery: gallery.map((f) => `/images/projects/${slug}/${f}`),
    }
  }
} else {
  mkdirSync(projectsDir, { recursive: true })
}

/* ---- site-level imagery: public/images/portrait.*, hero.*, backgrounds/ ---- */

const imagesDir = join(root, 'public', 'images')

/** @param {string} name */
function findNamed(name) {
  if (!existsSync(imagesDir)) return null
  const hit = readdirSync(imagesDir).find(
    (f) => basename(f, extname(f)).toLowerCase() === name && EXTS.has(extname(f).toLowerCase()),
  )
  return hit ? `/images/${hit}` : null
}

const backgroundsDir = join(imagesDir, 'backgrounds')
const backgrounds = existsSync(backgroundsDir)
  ? readdirSync(backgroundsDir)
      .filter((f) => EXTS.has(extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
      .map((f) => `/images/backgrounds/${f}`)
  : []

const site = {
  portrait: findNamed('portrait'),
  hero: findNamed('hero'),
  backgrounds,
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(
  outFile,
  JSON.stringify({ site, projects: manifest }, null, 2) + '\n',
  'utf8',
)

const count = Object.keys(manifest).length
const images = Object.values(manifest).reduce(
  (n, e) => n + (e.cover ? 1 : 0) + e.gallery.length,
  0,
)
console.log(
  `image-manifest: ${count} project folder(s), ${images} project image(s); ` +
    `portrait=${site.portrait ? 'yes' : 'no'}, backgrounds=${backgrounds.length}`,
)
