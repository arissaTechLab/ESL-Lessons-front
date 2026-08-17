import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import { buttonVariants } from '@/shared/components'

interface Differentiator {
  text: string
  icon: string
}

const DIFFERENTIATORS: readonly Differentiator[] = [
  {
    text: 'Visual-first design (images, GIFs, videos) to prompt real speaking',
    icon: 'M4 5h16v12H4zM4 17l5-5 3 3 4-4 4 4',
  },
  {
    text: 'Authentic content — from podcasts to quirky news — to keep it fresh',
    icon: 'M4 5h12v14H4zM8 9h4M8 13h4M18 8v9a2 2 0 0 0 2-2V9z',
  },
  {
    text: 'Open-ended grammar & vocab tasks that challenge even advanced learners',
    icon: 'M8 4h9a2 2 0 0 1 2 2v14l-5-3-5 3V6a2 2 0 0 1 2-2zM5 8v13',
  },
  {
    text: 'New formats like “Walk & Talk” to bring movement and energy into online learning',
    icon: 'M13 4a1.5 1.5 0 1 0 0 .01M11 8l3 2 1 4M9 21l2-5 3 1M14 14l3 1',
  },
]

export function WhatMakesDifferentSection() {
  return (
    <section className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-ink sm:text-4xl">
            What Makes These Lessons Different
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-ink-soft">
            These aren’t PDFs with fill-in-the-blanks. They’re full-on,
            immersive digital experiences.
          </p>
          <Link to={APP_ROUTES.PRICING} className={buttonVariants('primary', 'md', 'mt-8')}>
            Get free lessons
          </Link>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {DIFFERENTIATORS.map((item) => (
            <div key={item.text} className="flex flex-col items-center text-center">
              <span className="grid size-16 place-items-center rounded-full border-2 border-brand-300 text-brand-500">
                <svg
                  viewBox="0 0 24 24"
                  className="size-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={item.icon} />
                </svg>
              </span>
              <p className="mt-4 text-sm text-ink-soft">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
