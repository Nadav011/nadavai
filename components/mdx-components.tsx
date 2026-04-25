import type { MDXComponents } from "mdx/types"
import NextImage from "next/image"

export function getMDXComponents(overrides?: MDXComponents): MDXComponents {
  return {
    // ── Headings ──────────────────────────────────────────────────────────────
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl font-bold text-text mt-10 mb-4 leading-tight text-gradient-mixed">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl md:text-2xl font-bold text-text mt-10 mb-3 leading-snug border-b border-border pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg md:text-xl font-semibold text-cyan mt-8 mb-2 leading-snug">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-base font-semibold text-text-secondary mt-6 mb-2">
        {children}
      </h4>
    ),

    // ── Body text ─────────────────────────────────────────────────────────────
    p: ({ children }) => (
      <p className="text-text-secondary text-base leading-relaxed mb-5">
        {children}
      </p>
    ),

    // ── Code ──────────────────────────────────────────────────────────────────
    code: ({ children, className }) => {
      // If className is present it's a fenced code block child — leave styling
      // to the <pre> wrapper so we don't double-wrap.
      const isInline = !className
      if (isInline) {
        return (
          <code className="font-mono text-sm px-1.5 py-0.5 rounded bg-bg-elevated text-cyan border border-border/60">
            {children}
          </code>
        )
      }
      return <code className={className}>{children}</code>
    },
    pre: ({ children }) => (
      <pre className="relative my-6 rounded-xl border border-border bg-bg-surface overflow-x-auto p-4 text-sm font-mono leading-relaxed text-text-secondary">
        {/* top accent line */}
        <div className="absolute top-0 start-0 end-0 h-[2px] rounded-t-xl bg-gradient-to-r from-cyan/60 via-cyan/30 to-transparent rtl:bg-gradient-to-l" />
        {children}
      </pre>
    ),

    // ── Lists ─────────────────────────────────────────────────────────────────
    ul: ({ children }) => (
      <ul className="list-none ps-0 mb-5 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal ps-6 mb-5 space-y-2 text-text-secondary">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="relative ps-5 text-text-secondary leading-relaxed before:absolute before:start-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-cyan">
        {children}
      </li>
    ),

    // ── Blockquote ────────────────────────────────────────────────────────────
    blockquote: ({ children }) => (
      <blockquote className="relative my-6 ps-5 border-s-2 border-cyan/50 bg-cyan/5 rounded-e-xl py-3 pe-4 italic text-text-secondary">
        {children}
      </blockquote>
    ),

    // ── Horizontal rule ───────────────────────────────────────────────────────
    hr: () => (
      <hr className="my-8 border-none h-px bg-gradient-to-r from-transparent via-border to-transparent rtl:bg-gradient-to-l" />
    ),

    // ── Links ─────────────────────────────────────────────────────────────────
    a: ({ href, children }) => (
      <a
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noreferrer noopener" : undefined}
        className="text-cyan underline underline-offset-4 decoration-cyan/40 hover:decoration-cyan transition-colors duration-200"
      >
        {children}
      </a>
    ),

    // ── Strong / em ───────────────────────────────────────────────────────────
    strong: ({ children }) => (
      <strong className="font-semibold text-text">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-text-secondary">{children}</em>
    ),

    // ── Table ─────────────────────────────────────────────────────────────────
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-bg-elevated text-text-secondary font-mono text-xs uppercase tracking-wider">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-border/40">{children}</tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-bg-elevated/50 transition-colors duration-150">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-start text-text-muted font-medium">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-text-secondary">{children}</td>
    ),

    // ── Image ─────────────────────────────────────────────────────────────────
    // next/image requires width+height for static analysis; MDX images are
    // inlined with unknown dimensions, so we use fill + a sized container.
    img: ({ src, alt }) => (
      <span className="my-6 relative block w-full aspect-video rounded-xl overflow-hidden border border-border">
        <NextImage
          src={src ?? ""}
          alt={alt ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 900px"
        />
      </span>
    ),

    ...overrides,
  }
}
