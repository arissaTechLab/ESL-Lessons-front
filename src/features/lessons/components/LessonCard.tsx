import type { Lesson, LessonLevel } from '@/features/lessons/types/lesson.types'

const LEVEL_STYLES: Record<LessonLevel, string> = {
  Beginner:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Intermediate:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Advanced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
}

interface LessonCardProps {
  lesson: Lesson
  onStart: (lesson: Lesson) => void
}

export function LessonCard({ lesson, onStart }: LessonCardProps) {
  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-2xl dark:bg-brand-900/30">
          {lesson.emoji}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${LEVEL_STYLES[lesson.level]}`}
        >
          {lesson.level}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
        {lesson.title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">
        {lesson.description}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          ⏱ {lesson.durationMin} min
        </span>
        <button
          type="button"
          onClick={() => onStart(lesson)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
        >
          Start
        </button>
      </div>
    </article>
  )
}
