/** Headline figures for the admin overview cards. */
export interface DashboardMetrics {
  slidesDownloads: number
  pdfDownloads: number
  activeSubscriptions: number
  totalClients: number
  totalRevenue: number
  /** Percentage vs the previous month. */
  revenueGrowthThisMonth: number
}

/** One month of the 6-month downloads chart (zero-filled by the API). */
export interface DownloadsPoint {
  month: string
  label: string
  slides: number
  pdf: number
}

export interface TopLesson {
  id: string
  title: string
  slug: string
  downloads: number
  /** Share of the most-downloaded lesson, 0–100 — drives the progress bar. */
  percentage: number
}

/** Response of `GET /admin/dashboard`. */
export interface AdminDashboardOverview {
  metrics: DashboardMetrics
  downloadsChart: DownloadsPoint[]
  topLessons: TopLesson[]
}
