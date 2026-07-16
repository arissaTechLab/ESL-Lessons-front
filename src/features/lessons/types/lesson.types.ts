export type LessonLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface Lesson {
  id: string
  title: string
  level: LessonLevel
  description: string
  durationMin: number
  emoji: string
}
