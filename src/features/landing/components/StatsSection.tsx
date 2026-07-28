interface Stat {
  value: string
  label: string
  /** One or more SVG path `d` values that make up the icon. */
  icon: readonly string[]
}

const STATS: readonly Stat[] = [
  {
    value: '8+',
    label: 'hours per week curating podcast excerpts',
    // Microphone
    icon: [
      'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z',
      'M19 10v2a7 7 0 0 1-14 0v-2',
      'M12 19v3',
      'M8 22h8',
    ],
  },
  {
    value: '12+',
    label: 'hours spent creating each lesson unit',
    // Pencil
    icon: ['M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z'],
  },
  {
    value: '2-5',
    label: 'new lessons added to the library every month',
    // Books on a shelf (library)
    icon: ['M4 4v16', 'M8 8v12', 'M12 6v14', 'm16 6 4 14'],
  },
]

export function StatsSection() {
  return (
    <section className="bg-accent-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center text-center"
          >
            <span className="grid size-16 place-items-center rounded-full border-2 border-ink/20 text-ink">
              <svg
                viewBox="0 0 24 24"
                className="size-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {stat.icon.map((d) => (
                  <path key={d} d={d} />
                ))}
              </svg>
            </span>
            <p className="mt-4 font-heading text-4xl font-extrabold text-ink">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
