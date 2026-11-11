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
 * because this design has opinions a plugin does not share: Barlow Condensed
 * headings at a tight line-height over Barlow body at 1.75, square corners,
 * no rules (sections part by space and a mist tone step), no shadows.
 *
 * Note on the descendant variants below (`[&_p]:…`): they compile to
 * `.class p { … }`, specificity (0,1,1), which outranks the plain utility
 * (0,1,0) the child already carries. That is how the pull quote restyles its
 * own paragraph without `!important`.
 */

const ACCENT_LINK =
  'text-ink underline decoration-2 underline-offset-[3px] transition-colors duration-150 hover:text-muted'

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
    <h4 className="mt-10 font-head text-[1.375rem] leading-tight text-ink">
      {children}
    </h4>
  ),

  p: ({ children }) => (
    <p className="mt-6 font-body text-[18px] leading-[1.75] text-ink first:mt-0">
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
    <ul className="mt-6 list-disc space-y-2 pl-6 marker:text-ink">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="mt-6 list-decimal space-y-2 pl-6 marker:font-bold marker:text-ink">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="font-body text-[18px] leading-[1.75] text-ink [&_p]:mt-0 [&_p]:text-[18px] [&_ol]:mt-2 [&_ul]:mt-2">
      {children}
    </li>
  ),

  /* Editorial pull quote: a mist field, Barlow Condensed, set larger than the
     body and given room on both sides so it reads as a break in the argument. */
  blockquote: ({ children }) => (
    <blockquote className="my-s30 bg-mist px-6 py-6 sm:px-8 [&_p]:mt-4 [&_p]:font-head [&_p]:text-(length:--text-step-lead) [&_p]:leading-[1.25] [&_p]:text-ink [&_p:first-child]:mt-0">
      {children}
    </blockquote>
  ),

  code: ({ children }) => (
    <code className="bg-mist px-1.5 py-0.5 font-mono text-[0.88em] text-ink">
      {children}
    </code>
  ),

  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto bg-mist p-5 font-mono text-[15px] leading-[1.6] text-ink [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[inherit]">
      {children}
    </pre>
  ),

  /* A section break is space, not a drawn line. */
  hr: () => <hr className="my-s40 h-0 border-0" />,

  img: ({ src, alt, title }) => {
    const url = typeof src === 'string' ? src : undefined
    // Raw HTML is off, so a video is written as an image whose source is an
    // .mp4; its poster is the same path with a -poster.jpg suffix.
    if (url && /\.mp4$/i.test(url)) {
      return (
        <video
          src={url}
          poster={url.replace(/\.mp4$/i, '-poster.jpg')}
          controls
          playsInline
          preload="none"
          aria-label={alt ?? undefined}
          className="my-s30 block h-auto w-full bg-mist"
        />
      )
    }
    return (
      // Uploads are already resized to a display copy at upload time, and the
      // optimiser is off site-wide, so next/image would only add a wrapper.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={alt ?? ''}
        title={title}
        loading="lazy"
        decoding="async"
        className="my-s30 block h-auto w-full bg-mist"
      />
    )
  },

  table: ({ children }) => (
    <div className="mt-6 -mx-s20 overflow-x-auto px-s20 sm:mx-0 sm:px-0">
      <table className="w-full border-collapse border-2 border-ash text-left font-body text-[16px]">
        {children}
      </table>
    </div>
  ),

  th: ({ children }) => (
    <th className="border-2 border-ash bg-mist px-4 py-3 font-head text-[17px] text-ink">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="border-2 border-ash px-4 py-3 align-top leading-[1.6] text-ink">
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
