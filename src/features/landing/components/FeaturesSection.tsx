interface Feature {
  title: string
  description: string
  emoji: string
}

const FEATURES: readonly Feature[] = [
  {
    emoji: '⚡',
    title: 'Fast by default',
    description: 'Powered by Vite for instant HMR and lean production builds.',
  },
  {
    emoji: '🎨',
    title: 'Tailwind CSS v4',
    description:
      'Utility-first styling with the new CSS-first engine — no config file.',
  },
  {
    emoji: '🧩',
    title: 'Typed components',
    description: 'React 19 with strict TypeScript keeps refactors safe.',
  },
  {
    emoji: '🌗',
    title: 'Light & dark mode',
    description:
      'A persisted, class-based theme that respects system preference.',
  },
]

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Everything you need to start
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800"
            >
              <span className="text-3xl">{feature.emoji}</span>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
