import { buttonVariants } from '@/shared/components'

interface Offer {
  title: string
  description: string
}

const OFFERS: readonly Offer[] = [
  {
    title: 'Podcast-Based Units',
    description: 'Advanced collocations and deep discussion questions.',
  },
  {
    title: 'Story-Based Units',
    description:
      'GIFs and images introduce vocab through speaking - not reading definitions.',
  },
  {
    title: 'Phrasal Verb Deep Dives',
    description: 'Photos give context for speaking with confidence.',
  },
  {
    title: 'Visual Grammar',
    description:
      'Death to worksheets! Illustrated role-plays get them speaking with target grammar.',
  },
  {
    title: 'Pronunciation',
    description:
      'Those minimal pairs you’ve been meaning to make...less thrown together? Done!',
  },
  {
    title: 'The Whole Shebang',
    description:
      'very unit includes homework, all lessons are designed for spaced review, and each one comes with a step-by-step lesson plan.',
  },
]

export function WhatIOfferSection() {
  return (
    <section id="offer" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-start">
        {/* Image collage — supplied later */}
        <img
          src="/offer-img.webp"
          alt=""
          className="aspect-[4/5] w-full rounded-2xl object-cover"
        />

        {/* Copy */}
        <div>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Finally, ESL Materials Made for Your 1-on-1 Speaking Lessons!
            <p className="text-brand-500">Never. Prep. Again.</p>
          </h2>
          <p className="mt-4 text-ink-soft">
            Keep the natural conversation. Add the structure and review your
            students want.
          </p>

          <ul className="mt-8 space-y-4">
            {OFFERS.map((offer) => (
              <li key={offer.title} className="flex gap-3">
                <span
                  className="mt-2 size-2 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <p className="text-sm text-ink-soft">
                  <span className="font-semibold text-ink">{offer.title}:</span>{' '}
                  {offer.description}
                </p>
              </li>
            ))}
          </ul>

          <a
            href="#pricing"
            className={buttonVariants('primary', 'md', 'mt-8')}
          >
            Get free lessons
          </a>
        </div>
      </div>
    </section>
  )
}
