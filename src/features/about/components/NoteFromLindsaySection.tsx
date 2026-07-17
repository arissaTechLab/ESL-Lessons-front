import { Placeholder } from '@/shared/components'

export function NoteFromLindsaySection() {
  return (
    <section>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
        {/* Copy */}
        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
            A note from Lindsay
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-ink sm:text-4xl">
            You Like the Deep Dives? Me Too.
          </h2>
          <div className="mt-5 space-y-4 text-ink-soft">
            <p>
              If you’ve made it here, you’re probably curious. Maybe a fellow
              lover of the long read. So let me give it to you straight: this
              isn’t your average “About” page.
            </p>
            <p>
              It’s the full (possibly-too-honest) origin story of these ESL
              lessons — why I built them, what I couldn’t find online, and the
              lessons I learned while making lessons.
            </p>
            <p>Consider this your fair warning… and heartfelt welcome.</p>
          </div>
        </div>

        {/* Portrait — supplied later */}
        <Placeholder label="Photo" className="aspect-[4/5] w-full" />
      </div>
    </section>
  )
}
