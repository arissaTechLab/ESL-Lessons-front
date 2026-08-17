import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import { Placeholder, buttonVariants } from '@/shared/components'

interface Offer {
  title: string
  description: string
}

const OFFERS: readonly Offer[] = [
  {
    title: 'Dynamic Discussions',
    description:
      'Thought-provoking questions for fluency in informal and professional life.',
  },
  {
    title: 'Grammar in context',
    description:
      'Death to worksheets. Students speak with target grammar in illustrated role-plays.',
  },
  {
    title: 'Accelerated Vocab Acquisition',
    description:
      'Image-rich exercises enable students to start speaking with new words as soon as they’re introduced.',
  },
  {
    title: 'Vocab Retention',
    description:
      'Spaced repetition ensures students master vocabulary — a layered review system that shows progress lesson to lesson.',
  },
  {
    title: 'Authentic Listening & Collocations',
    description:
      'Challenge advanced learners with real-world vocab curated from the top podcasts.',
  },
  {
    title: 'Phrasal Verb Mastery',
    description:
      'Students can finally speak confidently with phrasal verbs through image-based exercises.',
  },
  {
    title: 'Time-Saving Teacher’s Guides',
    description:
      'Get clear instructions, answer keys, and life-changing extension ideas.',
  },
]

export function WhatIOfferSection() {
  return (
    <section id="offer" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-start">
        {/* Image collage — supplied later */}
        <div className="grid grid-cols-2 gap-3">
          <Placeholder label="Photo" className="col-span-2 aspect-[16/10]" />
          <Placeholder label="Photo" className="aspect-[4/5]" />
          <Placeholder label="Photo" className="aspect-[4/5]" />
        </div>

        {/* Copy */}
        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
            What I offer
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Finally, ESL Lessons That Engage Students &amp; Save You Hours
          </h2>
          <p className="mt-4 text-ink-soft">
            Tired of searching for extraordinary material for your online ESL
            classes? Get curiously fresh lessons — ready in seconds.
          </p>

          <ul className="mt-8 space-y-4">
            {OFFERS.map((offer) => (
              <li key={offer.title} className="flex gap-3">
                <span
                  className="mt-2 size-2 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <p className="text-sm text-ink-soft">
                  <span className="font-semibold text-ink">
                    {offer.title}:
                  </span>{' '}
                  {offer.description}
                </p>
              </li>
            ))}
          </ul>

          <Link to={APP_ROUTES.FREE_LESSONS} className={buttonVariants('primary', 'md', 'mt-8')}>
            Get free lessons
          </Link>
        </div>
      </div>
    </section>
  )
}
