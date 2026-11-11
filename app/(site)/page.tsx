import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { PRACTICES, PROFILE, PROJECTS, STATS } from '@/content'
import { siteImages } from '@/lib/images'
import { PRACTICE_PHOTOS } from '@/content/photos'
import { LoopVideo } from '@/components/home/loop-video'
import { PracticeExplorer, type PracticeItem } from '@/components/home/practice-explorer'

/* -------------------------------------------------------------------------- */
/* Photographs are Romeo's own event photographs (the organisers' official     */
/* images) except the four Volta pictures, which are credited Wikimedia        */
/* Commons photographs of the basin the research covers.                       */
/* -------------------------------------------------------------------------- */

const EMAIL = PROFILE.contact.find((c) => c.label === 'Email')!
const LINKEDIN = PROFILE.contact.find((c) => c.label === 'LinkedIn')!

const rise = (i: number) => ({ '--i': i }) as CSSProperties

/** Four plates, turned like pages in a book. Every one links to its project. */
const PLATES = [
  {
    slug: 'zev-supply-side-regulation',
    title: 'Zero-emission vehicle regulation',
    when: '2025–26',
    fact: 'UNEP and ClimateWorks, Ghana',
    src: '/images/blog/ssr-validation-workshop/plenary.jpg',
    alt: 'Plenary at the validation workshop for the zero-emission vehicle supply-side regulation',
    position: 'center 45%',
  },
  {
    slug: 'article-6-2-cookstove-carbon',
    title: 'Article 6.2 cookstove carbon programme',
    when: '2026',
    fact: 'ATEC eCook consultation, CSIR Accra',
    src: '/images/blog/atec-lsc-ghana/plenary-remarks.jpg',
    alt: 'Addressing the plenary at the ATEC eCook stakeholder consultation in Accra',
    position: 'center 30%',
  },
  {
    slug: 'guardian',
    title: 'GUARDIAN child-protection platform',
    when: '2026',
    fact: 'Pitched at the UNICEF StartUp Lab',
    src: '/images/blog/unicef-startup-lab-guardian/pitching-guardian.jpg',
    alt: 'Pitching the GUARDIAN platform at the UNICEF StartUp Lab, Accra',
    position: 'center 35%',
  },
  {
    slug: 'white-volta-water-budgets',
    title: 'White Volta water budgets',
    when: '2022',
    fact: 'Earth observation, northern Ghana',
    src: '/images/world/white-volta-1.jpg',
    alt: 'The White Volta in flood during the rainy season near Tamale, northern Ghana',
    position: 'center 55%',
  },
] as const

const PRACTICE_ITEMS: PracticeItem[] = PRACTICES.map((p) => {
  const projects = PROJECTS.filter((x) => x.practice === p.key)
  return {
    key: p.key,
    label: p.label,
    href: p.href,
    blurb: p.blurb,
    count: projects.length,
    recent: projects.slice(0, 3).map((x) => ({ slug: x.slug, title: x.title })),
    photo: PRACTICE_PHOTOS[p.key],
  }
})

const [NWA, YEARS, ARTICLES, LCOY] = STATS

const ROOM_FRAMES = [
  {
    kind: 'photo',
    src: '/images/blog/ayc-2025-green-entrepreneurship/on-the-panel.jpg',
    alt: 'Speaking on a panel at the African Youth Conference 2025',
    caption: 'On the panel, African Youth Conference 2025.',
    position: 'center 30%',
  },
  {
    kind: 'photo',
    src: '/images/blog/undp-sdg-dialogue-2026/consultation-session.jpg',
    alt: 'A consultation session at the UNDP Ghana SDG dialogue in 2026',
    caption: 'UNDP Ghana SDG dialogue, Accra, 2026.',
    position: 'center 38%',
  },
  {
    kind: 'video',
    src: '/images/blog/open-africa-power-2025-italian-module-top-10/video-1.mp4',
    poster: '/images/blog/open-africa-power-2025-italian-module-top-10/video-1-poster.jpg',
    alt: 'Film of the Open Africa Power 2025 Italian Module',
    caption: 'Open Africa Power 2025, Top 10 cohort, Italy. Film: Enel Foundation.',
    position: 'center',
  },
] as const

/* -------------------------------------------------------------------------- */

export default function HomePage() {
  const { portrait } = siteImages()

  return (
    <>
      {/* ============ HERO + INTRO: the name holds two corners ============ */}
      <div className="relative">
        {/* The pinned layer. Each half of the name sits on its own navy plate
            so it reads over the sky, the paper and every photograph. */}
        <h1
          aria-label={PROFILE.name}
          className="pointer-events-none sticky top-0 z-30 h-svh select-none text-[length:inherit]"
        >
          <span aria-hidden className="pointer-events-auto absolute left-4 top-4 bg-ink px-[0.14em] pb-[0.02em] pt-[0.1em] font-head text-[15vw] font-bold uppercase leading-[0.82] tracking-[-0.02em] text-sky sm:left-7 sm:top-7 lg:text-[clamp(72px,11vw,184px)]">
            Romeo
          </span>
          <span aria-hidden className="pointer-events-auto absolute bottom-4 right-4 bg-ink px-[0.14em] pb-[0.02em] pt-[0.1em] font-head text-[15vw] font-bold uppercase leading-[0.82] tracking-[-0.02em] text-sky sm:bottom-7 sm:right-7 lg:text-[clamp(72px,11vw,184px)]">
            Koduah
          </span>
        </h1>

        <div className="-mt-[100svh]">
          {/* ---- first screen ---- */}
          <section className="relative bg-sky lg:h-svh lg:min-h-[640px]" aria-label="Introduction">
            <div className="grid h-full lg:grid-cols-12">
              <div className="relative px-s30 pb-[calc(15vw+72px)] pt-[calc(15vw+56px)] lg:col-span-9 lg:pb-0 lg:pt-0">
                {portrait ? (
                  <div className="relative mb-8 aspect-square w-full overflow-hidden sm:aspect-3/2 lg:hidden">
                    <Image
                      src={portrait}
                      alt="Romeo Tweneboah Koduah"
                      fill
                      sizes="100vw"
                      className="object-cover object-[center_18%]"
                      priority
                    />
                  </div>
                ) : null}

                <div className="lg:absolute lg:left-[calc(100%/9*2)] lg:top-[38%] lg:max-w-[38ch]">
                  <p
                    data-rise
                    className="text-[clamp(1.25rem,1.05rem+0.6vw,1.625rem)] font-medium leading-[1.3] text-ink"
                  >
                    Environmental engineer and water data scientist in Ghana. I model Africa&rsquo;s
                    rivers and turn the evidence into policy.
                  </p>
                  <p data-rise style={rise(1)} className="mt-4 text-ink">
                    Now: water data science at IWMI, Accra.
                  </p>
                  <div
                    data-rise
                    style={rise(2)}
                    className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
                  >
                    <Link href="#work" className="btn">
                      <span>See the work</span>
                    </Link>
                    <Link href="/publications" className="arrow-link">
                      Publications <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </div>

              {portrait ? (
                <figure className="relative hidden lg:col-span-3 lg:block">
                  <div className="absolute inset-x-0 bottom-0 top-[96px] overflow-hidden">
                    <Image
                      src={portrait}
                      alt="Romeo Tweneboah Koduah"
                      fill
                      sizes="25vw"
                      className="object-cover object-top"
                      priority
                    />
                  </div>
                  <figcaption className="absolute right-full top-[104px] mr-3 rotate-180 whitespace-nowrap text-[0.9375rem] text-ink [writing-mode:vertical-rl]">
                    Photo: Orion Studios
                  </figcaption>
                </figure>
              ) : null}
            </div>
          </section>

          {/* ---- second screen: from the river to the room ----
              Pictures keep to the middle corridor so they never slide under
              the pinned plates in the corners. */}
          <section
            className="relative bg-paper px-s30 pb-[24svh] pt-[16svh] lg:min-h-[132svh] lg:p-0"
            aria-label="From the river to the room"
          >
            <p
              data-rise
              className="mb-14 max-w-[22ch] font-head text-[1.5rem] font-bold leading-[1.08] tracking-[-0.01em] text-ink sm:text-[2rem] lg:absolute lg:left-[65%] lg:top-[30svh] lg:mb-0 lg:max-w-[23ch] lg:text-[2.25rem]"
            >
              From the river to the room: water measured, modelled, then made policy.
            </p>

            <figure data-rise className="lg:absolute lg:left-[30%] lg:top-[8svh] lg:w-[31vw]">
              <div className="relative aspect-16/10 w-full overflow-hidden">
                <Image
                  src="/images/world/spillway-of-akosombo-dam.jpg"
                  alt="The spillway of Akosombo dam on the Volta"
                  fill
                  sizes="(min-width: 1024px) 31vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2 text-[0.9375rem] text-muted">
                The river: Akosombo spillway, Volta.
              </figcaption>
            </figure>

            <figure
              data-rise
              className="mt-12 w-[72%] lg:absolute lg:left-[30%] lg:top-[60svh] lg:mt-0 lg:w-[17vw]"
            >
              <div className="relative aspect-4/5 w-full overflow-hidden">
                <Image
                  src="/images/blog/ssr-validation-workshop/data-flows.jpg"
                  alt="Presenting the data flows of the regulatory framework at the validation workshop"
                  fill
                  sizes="(min-width: 1024px) 17vw, 72vw"
                  className="object-cover object-[45%_center]"
                />
              </div>
              <figcaption className="mt-2 text-[0.9375rem] text-muted">
                The model: data flows, put to validation.
              </figcaption>
            </figure>

            <figure
              data-rise
              className="ml-auto mt-12 w-[60%] lg:absolute lg:left-[48.5%] lg:top-[74svh] lg:ml-0 lg:mt-0 lg:w-[12.5vw]"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src="/images/blog/africa-e-mobility-week-2025-addis-ababa/photo-03.jpg"
                  alt="A panel on stage at Africa E-Mobility Week 2025 in Addis Ababa"
                  fill
                  sizes="(min-width: 1024px) 12.5vw, 60vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2 text-[0.9375rem] text-muted">
                The room: Addis Ababa, 2025.
              </figcaption>
            </figure>
          </section>
        </div>
      </div>

      {/* ======================= WORK: four plates ======================= */}
      <section id="work" aria-label="Selected work">
        {PLATES.map((plate) => (
          <Link
            key={plate.slug}
            href={`/work/${plate.slug}`}
            className="group relative block h-[82svh] overflow-hidden bg-ink lg:h-svh"
          >
            <Image
              src={plate.src}
              alt={plate.alt}
              fill
              sizes="100vw"
              className="scale-[1.12] object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.18]"
              style={{ objectPosition: plate.position }}
            />
            <div className="absolute inset-x-0 bottom-5 bg-ink/80 px-s30 py-4 text-paper lg:bottom-auto lg:top-1/2 lg:flex lg:h-[120px] lg:-translate-y-1/2 lg:items-center lg:py-0">
              <div data-rise className="mx-auto grid w-full max-w-(--container-wide) grid-cols-2 gap-x-6 gap-y-1 lg:grid-cols-[10%_1fr_auto] lg:items-baseline">
                <span className="tabular order-2 text-[0.9375rem] lg:order-1">{plate.when}</span>
                <h2 className="order-1 col-span-2 font-head text-[clamp(1.625rem,1rem+2.4vw,3.25rem)] font-bold uppercase leading-none tracking-[-0.01em] lg:order-2 lg:col-span-1">
                  {plate.title}
                  <span
                    aria-hidden
                    className="ml-3 inline-block transition-transform duration-200 group-hover:translate-x-2"
                  >
                    →
                  </span>
                </h2>
                <span className="order-3 text-right text-[0.9375rem]">{plate.fact}</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* ================== STATS: one figure owns the screen ================== */}
      <section
        className="relative flex min-h-[90svh] flex-col bg-sky px-s30 pb-s40 pt-s50"
        aria-labelledby="figure-heading"
      >
        <div className="mx-auto flex w-full max-w-(--container-wide) flex-1 flex-col">
          <h2
            id="figure-heading"
            data-rise
            className="text-[2.25rem] leading-none"
          >
            Water accounts, continent-wide
          </h2>

          <div className="mt-auto pt-[16vh] lg:grid lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <p
                data-rise
                style={rise(1)}
                className="tabular font-head text-[clamp(10rem,5rem+20vw,23.75rem)] font-bold leading-[0.8] tracking-[-0.04em] text-ink"
              >
                {NWA.value}
              </p>
              <p data-rise style={rise(2)} className="mt-6 max-w-[34ch] text-ink">
                {NWA.label}, in the{' '}
                <Link href="/work/nwa-tracker" className="arrow-link">
                  National Water Accounting Tracker
                </Link>{' '}
                built for IWMI, 2025–26.
              </p>
            </div>
            <div
              data-rise
              style={rise(3)}
              className="mt-12 grid gap-6 sm:grid-cols-3 lg:col-span-5 lg:mt-0"
            >
              {[YEARS, ARTICLES, LCOY].map((s) => (
                <div key={s.label}>
                  <p className="tabular font-head text-[clamp(1.625rem,1rem+2.4vw,3.25rem)] font-bold leading-none">
                    {s.value}
                    {'suffix' in s ? s.suffix : ''}
                  </p>
                  <p className="mt-2 text-[1rem] leading-snug text-ink">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ IN THE ROOM: three frames, each a curtain ============ */}
      <section aria-labelledby="room-heading" className="relative bg-sky pt-s40">
        <div className="relative z-20 px-s30">
          <div className="mx-auto max-w-(--container-wide)">
            <div data-rise className="-mb-28 w-full max-w-[360px] bg-paper p-6 sm:ml-[50%] lg:ml-[58%]">
              <h2 id="room-heading" className="text-[2.25rem] leading-none">
                In the room
              </h2>
              <p className="mt-3 text-[1rem]">
                Evidence only moves when someone carries it. I facilitate, convene and pitch: five
                hundred young leaders at LCOY Ghana, panels across Africa, a cohort in Italy.
              </p>
            </div>
          </div>
        </div>

        {ROOM_FRAMES.map((frame) => (
          <figure key={frame.src} className="sticky top-0 h-[88svh] overflow-hidden bg-ink lg:h-svh">
            {frame.kind === 'photo' ? (
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                sizes="100vw"
                className="drift object-cover"
                style={{ objectPosition: frame.position }}
              />
            ) : (
              <LoopVideo
                src={frame.src}
                poster={frame.poster}
                label={frame.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <figcaption className="absolute inset-x-0 bottom-0 flex h-[96px] items-center bg-ink/75 px-s30 text-[0.9375rem] text-paper">
              <span data-rise>{frame.caption}</span>
            </figcaption>
          </figure>
        ))}
      </section>

      {/* ============== THE LIVE THING: five practices, pick one ============== */}
      <section className="bg-paper px-s30 py-s60" aria-labelledby="practices-heading">
        <div className="mx-auto max-w-(--container-wide)">
          <PracticeExplorer items={PRACTICE_ITEMS} />
        </div>
      </section>

      {/* ================ CONTACT: one card on the river ================ */}
      <section aria-labelledby="contact-heading" className="relative">
        <div className="relative h-[70svh] overflow-hidden lg:h-svh">
          <Image
            src="/images/world/volta-asuogyaman-p1090982.jpg"
            alt="A small boat on the lower Volta near Atimpoku"
            fill
            sizes="100vw"
            className="object-cover object-[center_60%]"
          />
        </div>
        <div className="relative z-10 -mt-20 px-4 pb-s50 lg:absolute lg:right-[60px] lg:top-[60px] lg:mt-0 lg:px-0 lg:pb-0">
          <div data-rise className="w-full bg-paper p-8 lg:w-[400px]">
            <h2 id="contact-heading" data-rise style={rise(1)} className="text-[2.25rem] leading-none">
              Work together
            </h2>
            <p data-rise style={rise(2)} className="mt-3 text-[1rem]">Based in Ghana, working across West Africa and beyond.</p>
            <dl data-rise style={rise(3)} className="mt-6 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[1rem]">
              <dt>Research</dt>
              <dd className="text-right text-muted">collaboration</dd>
              <dt>Policy</dt>
              <dd className="text-right text-muted">regulation, carbon</dd>
              <dt>Data</dt>
              <dd className="text-right text-muted">modelling, software</dd>
              <dt>Rooms</dt>
              <dd className="text-right text-muted">facilitation, training</dd>
            </dl>
            <p className="mt-6 text-[1rem]">
              <a href={LINKEDIN.href} target="_blank" rel="noopener noreferrer" className="arrow-link">
                LinkedIn <span aria-hidden>→</span>
              </a>
            </p>
            <a
              href={`${EMAIL.href}?subject=${encodeURIComponent('Working together')}`}
              className="btn mt-6 w-full"
              data-rise
              style={rise(4)}
            >
              <span>Email Romeo</span>
            </a>
          </div>
        </div>
      </section>

    </>
  )
}
