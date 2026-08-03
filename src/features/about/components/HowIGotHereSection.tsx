const MILESTONES: readonly string[] = [
  'Born and raised in a small town on the West Coast of Canada. It was basically before the internet…there was a lot of time to mull things over.',
  'Moved to Vancouver to attend Simon Fraser University. Didn’t leave my student residence for over a week because I’d never taken a bus before and I was afraid to. Made friends with latinos and started learning Spanish.',
  'Got a degree in English Literature and Anthropology, as well as a 360-hour Teaching ESL Linguistics certificate. Learned how to take the bus.',
  'Moved to Taiwan to teach ESL. Taught for a year, then became a full-time jazz singer. Learned enough Mandarin to get by.',
  'Moved back to Vancouver, met a Mexican guy, got married.',
  'Found my vocation in teaching ESL to adult students at a local private school in Vancouver. I invested a lot of time in creating avant-garde activities like “prepositional poker” which I’d share with colleagues. “You should write a resource book!” they’d say.',
  'With a new baby and a 5 year old, I just mommed hard for several years.',
  'Started teaching ESL online, but Covid took out my lungs so I shifted my focus to creating the ESL speaking lesson materials of my dreams.',
  'These days, my lungs are much better! Now I’m pouring all that energy into lesson creation.',
]

export function HowIGotHereSection() {
  return (
    <section>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
        {/* Photo — matches the height of the timeline beside it */}
        <div className="overflow-hidden rounded-2xl">
          <img
            src="/about-bg-img.webp"
            alt=""
            className="h-full min-h-72 w-full object-cover"
          />
        </div>

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
