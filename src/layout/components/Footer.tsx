const FOOTER_COLUMNS = [
  {
    heading: 'Explore',
    links: ['All Lessons', 'Grammar Index', 'Method & Teaching Ideas', 'About'],
  },
  {
    heading: 'Support',
    links: ['FAQ', 'Privacy Policy', 'Terms of Service', 'Contact me'],
  },
] as const

function SocialIcon({ path, label }: { path: string; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border border-ink/15 text-ink-soft transition hover:border-brand-500 hover:text-brand-600"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
    </a>
  )
}

const SOCIALS = [
  {
    label: 'Facebook',
    path: 'M13 22v-8h3l1-4h-4V8c0-1 .3-1.5 1.7-1.5H17V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H7v4h3v8h3Z',
  },
  {
    label: 'Instagram',
    path: 'M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.8-7.8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM20 7.5c-.1-1.4-.4-2.6-1.4-3.6C17.6 2.9 16.4 2.6 15 2.5 13.6 2.4 9.4 2.4 8 2.5c-1.4.1-2.6.4-3.6 1.4C3.4 4.9 3.1 6.1 3 7.5c-.1 1.4-.1 5.6 0 7 .1 1.4.4 2.6 1.4 3.6 1 1 2.2 1.3 3.6 1.4 1.4.1 5.6.1 7 0 1.4-.1 2.6-.4 3.6-1.4 1-1 1.3-2.2 1.4-3.6.1-1.4.1-5.6 0-7Zm-1.9 8.5a3 3 0 0 1-1.7 1.7c-1.2.5-4 .4-5.4.4-1.4 0-4.2.1-5.4-.4a3 3 0 0 1-1.7-1.7c-.5-1.2-.4-4-.4-5.4 0-1.4-.1-4.2.4-5.4A3 3 0 0 1 6.6 5c1.2-.5 4-.4 5.4-.4 1.4 0 4.2-.1 5.4.4a3 3 0 0 1 1.7 1.7c.5 1.2.4 4 .4 5.4 0 1.4.1 4.2-.4 5.4Z',
  },
  {
    label: 'LinkedIn',
    path: 'M6.9 8.4H3.6V21h3.3V8.4ZM5.2 3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM21 21h-3.3v-6.1c0-1.5-.5-2.5-1.8-2.5-1 0-1.6.7-1.8 1.3-.1.2-.1.6-.1.9V21H10.7s.1-11.4 0-12.6H14v1.8c.4-.7 1.2-1.7 3-1.7 2.2 0 3.9 1.4 3.9 4.5V21Z',
  },
] as const

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + socials */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="size-7 text-ink"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2 6 10h3l-4 6h4l-4 6h14l-4-6h4l-4-6h3L12 2Z" />
                <rect x="11" y="19" width="2" height="3" />
              </svg>
              <span className="font-heading text-lg font-bold uppercase tracking-[0.15em] text-ink">
                ESL Lessons
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-ink-soft">
              Ready-to-teach ESL materials that engage students and save you
              hours of prep time.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map((social) => (
                <SocialIcon
                  key={social.label}
                  label={social.label}
                  path={social.path}
                />
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-ink">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-ink-soft">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="transition hover:text-brand-600"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-ink/10 pt-6 text-center text-xs text-ink-muted">
          © 2025 ESL Lessons. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
