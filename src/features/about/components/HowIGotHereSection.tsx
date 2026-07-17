import { Placeholder } from '@/shared/components'

const MILESTONES: readonly string[] = [
  'Born in the woods on Canada’s West Coast, pre-internet era. Lots of time to think.',
  'Got a degree in English Lit + Anthropology. Learned how to take the bus.',
  'Moved to Taiwan. Taught ESL. Became a jazz singer. Learned Mandarin.',
  'Moved back to Vancouver. Taught ESL in schools. Created original materials. Got told “You should write a book.”',
  'Got married. Had kids. Moved to Mexico (sunshine! community! lower rent!).',
  'Taught online… until COVID took out my lungs. Switched to lesson creation.',
  'Slowly got better. Now I can talk non-stop again — and I’m using that energy to build better lessons.',
]

export function HowIGotHereSection() {
  return (
    <section>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
        {/* Photo — supplied later */}
        <Placeholder label="Photo" className="aspect-[4/3] w-full" />

        {/* Timeline */}
        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
            My background
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-ink sm:text-4xl">
            How I Got Here
          </h2>
          <ul className="mt-6 space-y-3">
            {MILESTONES.map((milestone) => (
              <li key={milestone} className="flex gap-3">
                <span
                  className="mt-2 size-2 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <p className="text-sm text-ink-soft">{milestone}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
