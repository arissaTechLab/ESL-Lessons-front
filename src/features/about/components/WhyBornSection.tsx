import { Placeholder } from '@/shared/components'

interface Chapter {
  title: string
  description: string
}

const CHAPTERS: readonly Chapter[] = [
  {
    title: 'The Early Days: Improvised Lessons',
    description:
      'At first, I was at a bit of a loss - screenshots, news articles, last-minute warm-ups - I could pull off very good online English lessons…for several weeks. But when I’d had a student for months, I got this creeping sense of dread: they weren’t getting my best work. There was no consistent review or structure. And trial lessons felt more like I was selling my personality than a beautifully crafted learning system. Because I hadn’t created a system. There was no crafting. I didn’t enter the online classroom with a sense of pride and excitement about the material I was about to present. I needed that calibre of material...but I just didn’t have the time to make it - I was so busy teaching, the most I could do was a 20 minute lesson prep scramble.',
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
        <div className="items-start">
          <h2 className="font-heading text-3xl font-bold leading-tight text-ink sm:text-4xl">
            From Worksheets to Wow
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {CHAPTERS.map((chapter) => (
            <article key={chapter.title}>
              <Placeholder label="Photo" className="aspect-[16/10] w-full" />
              <h3 className="mt-5 font-heading text-lg font-semibold text-ink">
                {chapter.title}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">
                {chapter.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
