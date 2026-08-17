import type { LessonCardModel } from '@/features/lessons'

/** The signed-in client's plan, as returned by `GET /api/me/subscription`. */
export interface Subscription {
  id: string
  plan: '6-months' | '12-months'
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  startsAt: string
  endsAt: string
  renewsAt: string
  price: number
  currency: string
}

/** A lesson in the client's Materials list, stamped with its folder. */
export interface Material extends LessonCardModel {
  folderId: string | null
}

export interface AdminDashboard {
  metrics: {
    slidesDownloads: number
    pdfDownloads: number
    activeSubscriptions: number
    totalClients: number
    totalRevenue: number
    revenueGrowthThisMonth: number
  }
  downloadsChart: { month: string; label: string; slides: number; pdf: number }[]
  topLessons: {
    id: string
    title: string
    slug: string
    downloads: number
    percentage: number
  }[]
}
