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
      'Then, Covid really did a number on my lungs. Suddenly, I couldn’t teach for more than half an hour without getting lightheaded. This new restriction turned all of my focus towards creating the lessons I’d been wanting, but had never had the time to develop.One thing was clear: lessons needed to hit the sweet spot between the connected, satisfying conversation of a great speaking lesson, AND a system with structured review that lets students see their progress over the long term. Also, siliness. A liberal smattering of silliness was crucial.Through research, trial and error and ideas from some brilliant friends, I developed some key components: a scrolling system on Google Slides, GIF and image based vocab introduction, a walk & talk speaking review, and grammar focused on speaking in context.',
  },
  {
    title: 'The Solution: Smart, Visual, Human',
    description:
      '“Did you know that as you sleep, fluid gushes up from your spine and cleans out your brain??” My students and I were learning more than just English with the podcast-based lessons - they were a hit. Every day, I’d spend hours developing the lessons, then test and refine them by teaching for just one hour. Curating the perfect 15 minute podcast excerpts, making image-based speaking prompts - as my lungs slowly recovered, I realized I’d have to keep the same schedule so I could continue to focus all of my energy on creating these lesson materials. I hope you and your students enjoy these lessons as much as we do, and I welcome any feedback you’d like to pass along to help continually improve them. ',
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
