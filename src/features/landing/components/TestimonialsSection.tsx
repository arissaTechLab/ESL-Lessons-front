import { AsyncSection } from '@/shared/components'
import { useAsync } from '@/hooks'
import { contentService } from '@/features/landing/services/content.service'

/** Client quotes, editable from the admin panel. */
export function TestimonialsSection() {
  const state = useAsync((signal) => contentService.testimonials(signal), [])

  return (
    <section id="testimonials" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-ink sm:text-4xl">
          Trusted by ESL Teachers
          <br />
          Around the World
        </h2>

        <div className="mt-14">
          <AsyncSection
            state={state}
            skeleton={
              <div className="grid gap-8 md:grid-cols-3" aria-hidden="true">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className="h-44 animate-pulse rounded-xl bg-accent-100"
                  />
                ))}
              </div>
            }
            empty={null}
          >
            {(testimonials) => (
              <div className="grid gap-8 md:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <figure
                    key={testimonial.id}
                    className="flex flex-col items-center text-center"
                  >
                    <span
                      className="font-heading text-5xl leading-none text-brand-500"
                      aria-hidden="true"
                    >
                      &rdquo;
                    </span>
                    <blockquote className="mt-4 text-sm text-ink-soft">
                      {testimonial.quote}
                    </blockquote>
                    <figcaption className="mt-5">
                      <p className="font-heading font-semibold text-ink">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-ink-muted">{testimonial.role}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </AsyncSection>
        </div>
      </div>
    </section>
  )
}
