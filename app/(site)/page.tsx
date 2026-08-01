import Image from 'next/image'
import Link from 'next/link'
import { FEATURED_PROJECTS, PRACTICES, PROFILE, PROJECTS, STATS } from '@/content'
import { siteImages } from '@/lib/images'
import { Btn, BtnRow, Section, Wide } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { ProjectCard } from '@/components/site/project-card'
import { StatStrip } from '@/components/site/stat-strip'
import { PartnerMarquee } from '@/components/site/partner-marquee'
import { DotPattern } from '@/components/ui/dot-pattern'
import { cn } from '@/lib/utils'

/** Commissioning institutions, de-duplicated, in first-appearance order. */
const PARTNERS = Array.from(new Set(PROJECTS.map((p) => p.org))).slice(0, 24)

export default function HomePage() {
  const { portrait } = siteImages()

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-soft py-s50">
        <DotPattern
          width={22}
          height={22}
          cr={1}
          className={cn(
            'fill-forest/15',
            '[mask-image:radial-gradient(620px_circle_at_75%_35%,white,transparent)]',
          )}
        />
        <Wide className="relative">
          <div className="grid items-center gap-s30 lg:grid-cols-[2fr_1fr]">
            <div>
              <Reveal immediate>
                <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-forest">
                  Environmental Engineer · Water Data Scientist · Climate Policy
                </p>
              </Reveal>

              <Reveal immediate delay={0.06}>
                <h1 className="mt-5 text-rust">
                  Water, energy and climate systems — measured, modelled, made policy.
                </h1>
              </Reveal>

              <Reveal immediate delay={0.12}>
                <p className="mt-7 max-w-(--container-measure) font-body text-(length:--text-fluid-md) leading-normal text-ink/80">
                  {PROFILE.hero}
                </p>
              </Reveal>

              <Reveal immediate delay={0.18}>
                <BtnRow className="mt-9">
                  <Btn href="/research">Explore the work</Btn>
                  <Btn href="/publications" variant="outline" accent="var(--color-rust)">
                    Publications
                  </Btn>
                  <Btn href="/contact" variant="outline" accent="var(--color-forest)">
                    Get in touch
                  </Btn>
                </BtnRow>
              </Reveal>
            </div>

            {/* portrait, or an editorial practice index until one is added */}
            <Reveal immediate delay={0.24}>
              {portrait ? (
                <div className="relative aspect-2/3 w-full">
                  <Image
                    src={portrait}
                    alt="Romeo Tweneboah Koduah"
                    fill
                    sizes="(min-width: 1024px) 380px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <ul className="w-full">
                  {PRACTICES.map((p) => (
                    <li key={p.key}>
                      <Link
                        href={p.href}
                        className="group flex items-baseline justify-between gap-4 border-t-2 py-4 transition-colors duration-150"
                        style={{ borderColor: p.accent }}
                      >
                        <span
                          className="font-head text-xl leading-none transition-transform duration-150 group-hover:translate-x-1"
                          style={{ color: p.accent }}
                        >
                          {p.label}
                        </span>
                        <span
                          className="font-body text-xs font-bold tabular-nums"
                          style={{ color: p.accent }}
                        >
                          {String(
                            PROJECTS.filter((x) => x.practice === p.key).length,
                          ).padStart(2, '0')}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </div>
        </Wide>
      </section>

      {/* ========================== PRACTICES ========================== */}
      <Section>
        <Wide>
          <Reveal>
            <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
              Five practices, one question
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-3xl text-forest">
              How climate change reshapes water, energy and food — and what to do about it.
            </h2>
          </Reveal>

          <div className="mt-s40 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PRACTICES.map((p, i) => (
              <Reveal key={p.key} delay={0.06 * i}>
                <Link
                  href={p.href}
                  className="group flex h-full flex-col border-2 bg-paper p-6 transition-colors duration-150 hover:bg-soft"
                  style={{ borderColor: p.accent }}
                >
                  <span
                    className="font-body text-[11px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: p.accent }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 leading-[1.1]" style={{ color: p.accent }}>
                    {p.label}
                  </h3>
                  <p className="mt-4 flex-1 font-body text-sm leading-relaxed text-ink/75">
                    {p.blurb}
                  </p>
                  <span
                    className="mt-6 font-body text-sm font-bold transition-transform duration-150 group-hover:translate-x-1"
                    style={{ color: p.accent }}
                  >
                    View {String(PROJECTS.filter((x) => x.practice === p.key).length)}{' '}
                    projects <span aria-hidden>→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Wide>
      </Section>

      {/* ============================ STATS ============================ */}
      <Section tone="soft">
        <Wide>
          <Reveal>
            <StatStrip stats={STATS} />
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-s40 border-t-2 border-forest/15 pt-s30">
              <p className="mb-6 text-center font-body text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
                Commissioned and collaborating institutions
              </p>
              <PartnerMarquee items={PARTNERS} />
            </div>
          </Reveal>
        </Wide>
      </Section>

      {/* ========================= FEATURED WORK ======================== */}
      <Section>
        <Wide>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal>
                <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-indigo">
                  Selected work
                </p>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="mt-4 max-w-2xl text-indigo">
                  From continental discharge models to national regulation.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.12}>
              <Btn href="/systems" variant="outline" accent="var(--color-indigo)">
                All projects
              </Btn>
            </Reveal>
          </div>

          <div className="mt-s40 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_PROJECTS.map((project, i) => (
              <Reveal key={project.slug} delay={0.05 * i}>
                <ProjectCard project={project} className="h-full" priority={i < 3} />
              </Reveal>
            ))}
          </div>
        </Wide>
      </Section>

      {/* ============================ ABOUT ============================ */}
      <Section tone="soft">
        <Wide>
          <div className="grid items-center gap-s30 lg:grid-cols-2">
            <div>
              <Reveal>
                <h2 className="text-ember">Hi, I&rsquo;m Romeo.</h2>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="mt-6 font-body text-(length:--text-fluid-md) leading-normal text-ink/80">
                  {PROFILE.bio[0]}
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <BtnRow className="mt-8">
                  <Btn href="/about" accent="var(--color-ember)">
                    More about me
                  </Btn>
                  <Btn href="/speaking" variant="outline" accent="var(--color-emerald)">
                    Speaking &amp; training
                  </Btn>
                </BtnRow>
              </Reveal>
            </div>

            <Reveal delay={0.18}>
              <div className="border-2 border-ember/30 bg-paper p-6 sm:p-8">
                <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-ember">
                  Currently
                </p>
                <ul className="mt-5 space-y-4">
                  {PROJECTS.filter((p) => /Present|Ongoing|2026/.test(p.period))
                    .slice(0, 5)
                    .map((p) => (
                      <li key={p.slug} className="rule pt-4 first:border-t-0 first:pt-0">
                        <Link href={`/work/${p.slug}`} className="group block">
                          <span className="font-head text-lg leading-tight text-ink transition-colors duration-150 group-hover:text-ember">
                            {p.title}
                          </span>
                          <span className="mt-1 block font-body text-[13px] text-ink/55">
                            {p.org} · {p.period}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Wide>
      </Section>

      {/* ============================= CTA ============================= */}
      <Section tone="forest" className="text-center">
        <Wide>
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-soft">
              Working on water, energy or climate? Let&rsquo;s talk.
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mx-auto mt-6 max-w-(--container-measure) font-body text-(length:--text-fluid-md) leading-normal text-soft/80">
              Research collaborations, policy and regulatory work, modelling and data
              science, digital systems, facilitation and training.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <BtnRow align="center" className="mt-9">
              <Btn href="/contact">Get in touch</Btn>
              <Btn href="/about" variant="outline" accent="var(--color-soft)">
                Read the full background
              </Btn>
            </BtnRow>
          </Reveal>
        </Wide>
      </Section>
    </>
  )
}
