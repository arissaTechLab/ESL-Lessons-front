interface Testimonial {
  quote: string
  name: string
  role: string
}

const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      'Lindsay’s lessons have completely changed my prep routine. What used to take me 2–3 hours now takes 15 minutes. I finally have my evenings back — and my students love the content!',
    name: 'Emily R.',
    role: 'Online ESL Tutor',
  },
  {
    quote:
      'My students are speaking more than ever! The discussion prompts and role-plays spark real conversations, and I’ve seen a huge boost in their confidence.',
    name: 'Carlos M.',
    role: 'High School ESL Teacher',
  },
  {
    quote:
      'These lessons are a dream. I just open the slides and teach. The grammar explanations, visuals, and activities are all there — no extra work needed.',
    name: 'Sophie L.',
    role: 'Adult ESL Instructor',
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-ink sm:text-4xl">
          Trusted by ESL Teachers
          <br />
          Around the World
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.name}
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
      </div>
    </section>
  )
}
