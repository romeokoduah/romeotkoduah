# romeotkoduah.org

Personal site of Romeo Tweneboah Koduah — water, energy and climate systems.

Next.js 15 (App Router) + Tailwind v4 + [MagicUI](https://magicui.design),
exported as static HTML and served by nginx on a Contabo VPS.

## Running locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Building

```bash
npm run build        # regenerates the image manifest, then exports to ./out
npm run typecheck
```

`output: 'export'` means the build produces plain HTML/CSS/JS in `out/` — no
Node process runs on the server.

## Deploying

```powershell
./deploy.ps1              # build, upload, swap in, verify
./deploy.ps1 -SkipBuild   # ship the existing ./out
```

The script tars `out/`, uploads it, unpacks into a staging directory and only
then swaps it into place, so a failed upload leaves the live site untouched.

Server: `root@169.58.42.182`, web root `/var/www/romeotkoduah.org`, nginx vhost
`/etc/nginx/sites-available/romeotkoduah.org`, HTTPS via Let's Encrypt
(auto-renewing through `certbot.timer`). The box also hosts several unrelated
sites — the vhost matches on server name only and touches nothing else.

## Adding content

**Projects, publications, awards** — everything is typed data in `content/`.
Edit the relevant file and rebuild; there is no CMS.

| File | Holds |
|---|---|
| `content/profile.ts` | Bio, contact links, the five practices, homepage stats |
| `content/projects.ts` | All 35 projects — the site's backbone |
| `content/publications.ts` | Journal articles, manuscripts under review, reports |
| `content/education.ts`, `awards.ts`, `certifications.ts`, `memberships.ts`, `skills.ts` | About page sections |
| `content/speaking.ts` | Facilitation, conferences, teaching, leadership |

Adding a project: add an entry to `content/projects.ts`, then run
`node scripts/build-images-doc.mjs` to refresh `IMAGES.md`.

**Photos** — see [IMAGES.md](IMAGES.md). Drop files into
`public/images/projects/<slug>/` and rebuild; the manifest is generated
automatically by `scripts/build-image-manifest.mjs` on every build.

## Design

The visual language is documented in
[`docs/superpowers/specs/2026-07-30-portfolio-redesign-design.md`](docs/superpowers/specs/2026-07-30-portfolio-redesign-design.md).

In short: Oswald 500 headings at `line-height: 1` over Open Sans body at `1.5`,
warm off-white `#f8f6f6` backgrounds, one accent colour per practice, square
corners, 2px borders, no shadows. Tokens live at the top of `app/globals.css` —
change them there, not in components.
