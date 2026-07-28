import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
        {/* Copy */}
        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
            About me
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-ink sm:text-4xl">
            From Creeping Dread to Polished, Thoughtful Lessons.
          </h2>
          <p className="mt-5 text-ink-soft">
            If you’re reading this, perhaps you too are a fan of the deep
            dive…curious to dig into the details. Here’s a bit about why I
            created these lessons. Wait, actually, it’s the full, unabridged
            saga of how and why I created these lessons. Welp, you’ve been
            warned.
          </p>
          <p className="mt-4 text-ink-soft">
            When I started teaching ESL online, I scoured the internet for
            ready-made ESL lesson materials full of images, GIFs, and authentic
            sources. Earnestly embracing the digital age, I was certain I would
            find this new generation of ESL lesson plans awaiting me online!
            Instead, what I found was…in the words of one frustrated redditor:
            “hot garbage.”
          </p>
          <Link
            to={APP_ROUTES.ABOUT}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-600 transition hover:text-brand-700"
          >
            I must know the full story
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Portrait */}
        <img
          src="/Lindsay.webp"
          alt=""
          className="aspect-[4/5] w-full rounded-2xl object-cover"
        />
      </div>
    </section>
  )
}
