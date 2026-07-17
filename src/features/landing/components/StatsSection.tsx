interface Stat {
  value: string
  label: string
  icon: string
}

const STATS: readonly Stat[] = [
  { value: '100+', label: 'resources', icon: 'M4 6h16M4 12h16M4 18h10' },
  {
    value: '100+',
    label: 'teachers helped',
    icon: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-8 9a8 8 0 0 1 16 0',
  },
  {
    value: '100+',
    label: 'happy students',
    icon: 'M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 16.5 7.1 18l.9-5.5-4-3.9L9.5 8 12 3Z',
  },
]

export function StatsSection() {
  return (
    <section className="bg-accent-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center">
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
                <path d={stat.icon} />
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
