/**
 * Scans public/images/projects/<slug>/ and emits content/image-manifest.json.
 *
 * Drop photos into the folder named after a project slug and rebuild — no code
 * changes needed. `cover.*` becomes the card image and detail hero; any other
 * image becomes part of the detail-page gallery, sorted by filename.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
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

/* ---- institution logos: public/images/logos/<key>.<ext> ------------------ */

const logosDir = join(imagesDir, 'logos')
const LOGO_EXTS = new Set([...EXTS, '.svg'])

/**
 * A logo downloaded from the web can easily be an HTML error page wearing an
 * .svg extension. Check the actual bytes rather than trusting the extension —
 * a missing logo degrades to a monogram, a broken one renders as a broken
 * image on a live page.
 * @param {string} file
 */
function isRealImage(file) {
  const buf = readFileSync(file)
  if (buf.length < 400) return false
  const head = buf.subarray(0, 1024).toString('latin1')
  if (/<!doctype html|<html[\s>]/i.test(head)) return false
  if (buf[0] === 0x89 && buf.subarray(1, 4).toString('latin1') === 'PNG') return true
  if (buf[0] === 0xff && buf[1] === 0xd8) return true // JPEG
  if (head.startsWith('RIFF') && head.includes('WEBP')) return true
  if (buf.subarray(0, 6).toString('latin1').startsWith('GIF8')) return true
  // SVG may open with an XML declaration, a doctype or comments before <svg.
  return /<svg[\s>]/i.test(buf.subarray(0, 8192).toString('utf8'))
}

/** @type {Record<string, string>} */
const logos = {}
const rejected = []
if (existsSync(logosDir)) {
  for (const f of readdirSync(logosDir)) {
    const ext = extname(f).toLowerCase()
    if (!LOGO_EXTS.has(ext)) continue
    if (!isRealImage(join(logosDir, f))) {
      rejected.push(f)
      continue
    }
    logos[basename(f, extname(f))] = `/images/logos/${f}`
  }
}
if (rejected.length > 0) {
  console.warn(`image-manifest: skipped ${rejected.length} unusable logo file(s): ${rejected.join(', ')}`)
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(
  outFile,
  JSON.stringify({ site, projects: manifest, logos }, null, 2) + '\n',
  'utf8',
)

const count = Object.keys(manifest).length
const images = Object.values(manifest).reduce(
  (n, e) => n + (e.cover ? 1 : 0) + e.gallery.length,
  0,
)
console.log(
  `image-manifest: ${count} project folder(s), ${images} project image(s); ` +
    `portrait=${site.portrait ? 'yes' : 'no'}, backgrounds=${backgrounds.length}, ` +
    `logos=${Object.keys(logos).length}`,
)
