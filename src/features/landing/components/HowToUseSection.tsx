import { Placeholder } from '@/shared/components'

export function HowToUseSection() {
  return (
    <section id="how-to-use" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-heading text-3xl font-bold text-ink sm:text-4xl">
            How are these lessons different?
          </h2>
          <p className="max-w-md text-sm text-ink-soft">
            Teaching online speaking lessons? There’s nothing else like these
            lesson materials!
          </p>
        </div>

        {/* Video — supplied later */}
        <Placeholder className="mt-10 aspect-video w-full bg-accent-200">
          <button
            type="button"
            aria-label="Play video"
            className="grid size-16 place-items-center rounded-full bg-cream/90 text-ink shadow-md transition hover:scale-105 hover:bg-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-7 translate-x-0.5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7L8 5Z" />
            </svg>
          </button>
        </Placeholder>
      </div>
    </section>
  )
}
