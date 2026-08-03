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
            I wasn’t a novice when I started teaching English online; I had a
            TESL/Linguistics degree and years of classroom experience. But my
            arsenal of winning PDFs and ESL activities fell short in my online
            classes. My students were happy — I was successfully winging it with
            screenshots and some decent PDFs…but as they became long-term
            regulars, I felt this creeping dread. I was letting them down with
            mediocre materials.
          </p>
          <p className="mt-4 text-ink-soft">
            But I was so busy teaching, I just didn’t have the hours (or the
            energy) it would take to develop entirely new materials for the
            online, 1-on-1 speaking lesson. Then, long-COVID hit my lungs. I
            couldn't breathe well enough to teach - but I could work silently.
            So I finally built my dream system: image-rich Google Slides for
            deep conversation and structured review. These days, I pour all my
            energy into creating these materials, so you can just enjoy
            teaching, and get paid for every hour you work.
          </p>
          <Link
            to={APP_ROUTES.ABOUT}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-600 transition hover:text-brand-700"
          >
            I must know more
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
