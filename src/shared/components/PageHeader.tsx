import type { ReactNode } from 'react'

interface PageHeaderProps {
  /** Main heading — the only piece that changes between subpages. */
  title: string
  /** Optional supporting line under the title (text, or JSX for line breaks). */
  subtitle?: ReactNode
  /** Background image. Defaults to the shared subpage header image. */
  imageSrc?: string
}

/**
 * Shared header band for public subpages (About, and future ones). Dark
 * overlay on a background image with a centered title/subtitle.
 */
export function PageHeader({
  title,
  subtitle,
  imageSrc = '/header_pages.webp',
}: PageHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {/* Background image */}
      <div className="absolute inset-0 -z-20">
        <img src={imageSrc} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 bg-ink/55" aria-hidden="true" />

      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-28">
        <h1 className="font-heading text-3xl font-bold leading-tight text-cream sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-xl text-cream/80">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
