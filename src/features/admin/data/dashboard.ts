export interface MonthlyDownloads {
  month: string
  /** Google Slides lesson materials downloaded. */
  slides: number
  /** PDF lesson plans downloaded. */
  pdf: number
}

/** Downloads per month (mock — fed by real analytics later). */
export const DOWNLOADS_MONTHLY: readonly MonthlyDownloads[] = [
  { month: 'Jan', slides: 120, pdf: 84 },
  { month: 'Feb', slides: 145, pdf: 96 },
  { month: 'Mar', slides: 160, pdf: 110 },
  { month: 'Apr', slides: 190, pdf: 132 },
  { month: 'May', slides: 210, pdf: 148 },
  { month: 'Jun', slides: 235, pdf: 165 },
]

export interface TopLesson {
  title: string
  downloads: number
}

/** Most downloaded lessons (mock). */
export const TOP_DOWNLOADED_LESSONS: readonly TopLesson[] = [
  { title: 'Talking About the Future of Space Travel', downloads: 312 },
  { title: 'The Science of Sleep and Daily Habits', downloads: 268 },
  { title: 'Remote Work and the Future of the Office', downloads: 241 },
  { title: 'How AI Is Changing Everyday Life', downloads: 205 },
  { title: 'Street Food Culture Around the World', downloads: 187 },
]
