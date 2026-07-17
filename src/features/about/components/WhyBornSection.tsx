import { Placeholder } from '@/shared/components'

interface Chapter {
  title: string
  description: string
}

const CHAPTERS: readonly Chapter[] = [
  {
    title: 'The Early Days: Improvised Lessons',
    description:
      'Screenshots, news articles, last-minute warm-ups — I made it work. But it wasn’t structured, scalable, or professional.',
  },
  {
    title: 'What Was Missing: A Real System',
    description:
      'Trial lessons felt like I was selling my personality, not a method. Students needed thoughtful, intentional learning — not guesswork.',
  },
  {
    title: 'The Solution: Smart, Visual, Human',
    description:
      'I built what I wished existed: image-rich, real-world content, designed for actual conversations — not just grammar drills.',
  },
]

export function WhyBornSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <h2 className="font-heading text-3xl font-bold leading-tight text-ink sm:text-4xl">
            From Worksheets to Wow: Why These Lessons Were Born
          </h2>
          <div className="space-y-4 text-ink-soft">
            <p>
              When I started teaching ESL online, I expected a treasure trove of
              rich, visual lessons — GIFs, videos, dynamic content. What I found
              instead? Glorified worksheets. Fill in the blanks, a sad image at
              the top, or a dull “correct/incorrect” pop-up.
            </p>
            <p>
              It felt like someone had uploaded a 90s textbook. That’s not what
              one-on-one learning needs — and definitely not what students
              deserve.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {CHAPTERS.map((chapter) => (
            <article key={chapter.title}>
              <Placeholder label="Photo" className="aspect-[16/10] w-full" />
              <h3 className="mt-5 font-heading text-lg font-semibold text-ink">
                {chapter.title}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{chapter.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
