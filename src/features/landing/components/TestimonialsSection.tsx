interface Testimonial {
  quote: string
  name: string
  role: string
  /** Profile photo — supplied later; falls back to an avatar placeholder. */
  photo?: string
  /** LinkedIn profile URL — replace the '#' placeholders with real links. */
  linkedin: string
}

const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      'These lessons are a dream. The amount of time it would take me to create something like this with pages of visuals and current podcast content- it’s an absolute life saver.',
    name: 'Felisha Martin',
    role: 'ESL Teacher and Academic Coach',
    linkedin: '#',
  },
  {
    quote:
      'My speaking has improved so much with these lessons! Talking about all the GIFs and pictures makes it very natural and spontaneous. The walking review part is a great way to change the vibe.',
    name: 'Luis Cervera',
    role: 'English Language Learner',
    linkedin: '#',
  },
  {
    quote:
      'When I started teaching English online, I didn’t want to work for an online school, but I wasn’t sure how to structure my lessons. With these lessons, I can confidently charge professional rates.',
    name: 'Isaias Peraza',
    role: 'Science Instructor & Freelance ESL Tutor',
    linkedin: '#',
  },
]

function Avatar({ photo, name }: { photo?: string; name: string }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="size-20 rounded-full object-cover"
      />
    )
  }
  return (
    <span
      className="grid size-20 place-items-center rounded-full bg-accent-200 text-accent-700"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    </span>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M6.9 8.4H3.6V21h3.3V8.4ZM5.2 3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM21 21h-3.3v-6.1c0-1.5-.5-2.5-1.8-2.5-1 0-1.6.7-1.8 1.3-.1.2-.1.6-.1.9V21H10.7s.1-11.4 0-12.6H14v1.8c.4-.7 1.2-1.7 3-1.7 2.2 0 3.9 1.4 3.9 4.5V21Z" />
    </svg>
  )
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-ink sm:text-4xl">
          What ESL Teachers and
          <br />
          Students Say
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex flex-col items-center text-center"
            >
              <Avatar photo={testimonial.photo} name={testimonial.name} />

              <blockquote className="mt-5 text-sm text-ink-soft">
                {testimonial.quote}
              </blockquote>

              <figcaption className="mt-5">
                <div className="flex items-center justify-center gap-2">
                  <p className="font-heading font-semibold text-ink">
                    {testimonial.name}
                  </p>
                  <a
                    href={testimonial.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${testimonial.name} on LinkedIn`}
                    className="text-ink-soft transition hover:text-brand-600"
                  >
                    <LinkedInIcon />
                  </a>
                </div>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {testimonial.role}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
