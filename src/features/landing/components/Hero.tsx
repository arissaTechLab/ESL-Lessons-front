import { Placeholder, buttonVariants } from '@/shared/components'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image — supplied later */}
      <div className="absolute inset-0 -z-10">
        <Placeholder
          label="Hero image"
          className="h-full w-full rounded-none border-0 bg-accent-200"
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-xl rounded-2xl bg-cream/90 p-8 shadow-sm backdrop-blur-sm sm:p-10">
          <h1 className="font-heading text-4xl font-extrabold uppercase leading-tight tracking-tight text-ink sm:text-5xl">
            Wow your
            <br />
            ESL students
          </h1>
          <p className="mt-4 font-heading text-xl font-semibold text-brand-500 sm:text-2xl">
            With ZERO prep-time
          </p>
          <p className="mt-5 text-base text-ink-soft">
            ESL lesson plans for English language teachers with intermediate to
            advanced adult students. Visual grammar, podcast, and story-based
            lessons. Phrasal verb deep dives.
          </p>
          <a href="#offer" className={buttonVariants('primary', 'md', 'mt-8')}>
            Get free lessons
          </a>
        </div>
      </div>
    </section>
  )
}
