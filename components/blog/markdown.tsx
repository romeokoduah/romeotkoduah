import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * Post bodies, rendered from markdown.
 *
 * Raw HTML is deliberately NOT enabled. `rehype-raw` is the only way to get it
 * through react-markdown, and it is not installed — a post body is authored in
 * the dashboard, but the dashboard is one compromised password away from being
 * an HTML injection point, and nothing in the writing needs it.
 *
 * Every element is styled explicitly rather than through a typography plugin,
 * because this design has opinions a plugin does not share: Oswald headings at
 * a tight line-height over Open Sans body at 1.75, square corners, 2px rules,
 * no shadows.
 *
 * Note on the descendant variants below (`[&_p]:…`): they compile to
 * `.class p { … }`, specificity (0,1,1), which outranks the plain utility
 * (0,1,0) the child already carries. That is how the pull quote restyles its
 * own paragraph without `!important`.
 */

const ACCENT_LINK =
  'text-indigo underline decoration-2 underline-offset-[3px] transition-colors duration-150 hover:text-ember'

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-s30 font-head text-(length:--text-h3) leading-[1.1] text-ink">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="mt-s20 font-head text-(length:--text-h4) leading-[1.25] text-ink">
      {children}
    </h3>
  ),

  h4: ({ children }) => (
    <h4 className="mt-10 font-head text-[18px] uppercase leading-tight tracking-[0.06em] text-ink/80">
      {children}
    </h4>
  ),

  p: ({ children }) => (
    <p className="mt-6 font-body text-[18px] leading-[1.75] text-ink/85 first:mt-0">
      {children}
    </p>
  ),

  a: ({ href, children }) => {
    const external = /^https?:/i.test(href ?? '')
    return (
      <a
        href={href}
        className={ACCENT_LINK}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  },

  ul: ({ children }) => (
    <ul className="mt-6 list-disc space-y-2 pl-6 marker:text-indigo">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="mt-6 list-decimal space-y-2 pl-6 marker:font-bold marker:text-indigo">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="font-body text-[18px] leading-[1.75] text-ink/85 [&_p]:mt-0 [&_p]:text-[18px] [&_ol]:mt-2 [&_ul]:mt-2">
      {children}
    </li>
  ),

  /* Editorial pull quote: a 4px accent rule, Oswald, set larger than the body
     and given room on both sides so it reads as a break in the argument. */
  blockquote: ({ children }) => (
    <blockquote className="my-s30 border-l-4 border-indigo py-1 pl-6 sm:pl-8 [&_p]:mt-4 [&_p]:font-head [&_p]:text-(length:--text-fluid-md) [&_p]:font-light [&_p]:leading-[1.3] [&_p]:text-indigo">
      {children}
    </blockquote>
  ),

  code: ({ children }) => (
    <code className="border border-ink/10 bg-soft px-1.5 py-0.5 font-mono text-[0.88em] text-ink">
      {children}
    </code>
  ),

  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto border-2 border-ink/12 bg-soft p-5 font-mono text-[15px] leading-[1.6] text-ink [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[inherit]">
      {children}
    </pre>
  ),

  hr: () => <hr className="my-s30 border-0 border-t-2 border-ink/12" />,

  img: ({ src, alt, title }) => (
    // Uploads are already resized to a display copy at upload time, and the
    // optimiser is off site-wide, so next/image would only add a wrapper.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === 'string' ? src : undefined}
      alt={alt ?? ''}
      title={title}
      loading="lazy"
      decoding="async"
      className="my-s30 block h-auto w-full border-2 border-ink/10 bg-soft"
    />
  ),

  table: ({ children }) => (
    <div className="mt-6 -mx-s20 overflow-x-auto px-s20 sm:mx-0 sm:px-0">
      <table className="w-full border-collapse border-2 border-ink/15 text-left font-body text-[16px]">
        {children}
      </table>
    </div>
  ),

  th: ({ children }) => (
    <th className="border-2 border-ink/15 bg-soft px-4 py-3 font-head text-[16px] font-medium text-ink">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="border-2 border-ink/15 px-4 py-3 align-top leading-[1.6] text-ink/85">
      {children}
    </td>
  ),

  strong: ({ children }) => <strong className="font-bold text-ink">{children}</strong>,
}

export function Markdown({ source }: { source: string }) {
  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  )
}
