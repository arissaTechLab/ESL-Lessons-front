import { useMemo, useState } from 'react'
import { LessonCard } from '@/features/lessons/components/LessonCard'
import { LESSONS } from '@/features/lessons/data/lessons'
import type { Lesson } from '@/features/lessons/types/lesson.types'

export function LessonsSection() {
  const [startedIds, setStartedIds] = useState<ReadonlySet<string>>(new Set())

  const handleStart = (lesson: Lesson) => {
    setStartedIds((prev) => {
      const next = new Set(prev)
      next.add(lesson.id)
      return next
    })
  }

  const progress = useMemo(
    () => Math.round((startedIds.size / LESSONS.length) * 100),
    [startedIds],
  )

  return (
    <section id="lessons" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Browse lessons
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Pick a level and start practicing. Your progress updates live.
          </p>
        </div>

        <div className="min-w-52">
          <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-300">
            <span>Started</span>
            <span>
              {startedIds.size}/{LESSONS.length}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LESSONS.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} onStart={handleStart} />
        ))}
      </div>
    </section>
  )
}
