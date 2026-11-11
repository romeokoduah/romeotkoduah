'use client'

import { usePathname } from 'next/navigation'

/**
 * Picture credits for the homepage, set in the footer's quiet line so they
 * close the page instead of sitting above a heading. Other pages credit
 * their pictures beside them.
 */
export function HomeCredits() {
  const pathname = usePathname()
  if (pathname !== '/') return null
  return (
    <div className="mt-8">
      <p className="max-w-[75ch] text-[0.9375rem] text-paper/85">
                Portrait: Orion Studios. Event photographs: the organisers&rsquo; official images.
                Pictures of the Volta via Wikimedia Commons:{' '}
                <a className="underline underline-offset-4 hover:text-sky" href="https://commons.wikimedia.org/wiki/File:White_Volta_1.jpg">
                  &ldquo;White Volta 1&rdquo;
                </a>{' '}
                by Nimatu15,{' '}
                <a className="underline underline-offset-4 hover:text-sky" href="https://creativecommons.org/licenses/by-sa/4.0">
                  CC BY-SA 4.0
                </a>
                ;{' '}
                <a
                  className="underline underline-offset-4 hover:text-sky"
                  href="https://commons.wikimedia.org/wiki/File:Kogendo_p%C9%A9%CA%8B%CA%8Bdgre_White_Volta_Mogre_wa.jpg"
                >
                  canoe crossing the White Volta
                </a>{' '}
                by Cdilalo47, CC BY-SA 4.0;{' '}
                <a
                  className="underline underline-offset-4 hover:text-sky"
                  href="https://commons.wikimedia.org/wiki/File:Spillway_of_Akosombo_dam.jpg"
                >
                  &ldquo;Spillway of Akosombo dam&rdquo;
                </a>{' '}
                by ZSM,{' '}
                <a className="underline underline-offset-4 hover:text-sky" href="https://creativecommons.org/licenses/by-sa/3.0">
                  CC BY-SA 3.0
                </a>
                ;{' '}
                <a
                  className="underline underline-offset-4 hover:text-sky"
                  href="https://commons.wikimedia.org/wiki/File:Volta,_Asuogyaman_(P1090982).jpg"
                >
                  &ldquo;Volta, Asuogyaman&rdquo;
                </a>{' '}
                by Matti Blume, CC BY-SA 4.0.
              </p>
    </div>
  )
}
