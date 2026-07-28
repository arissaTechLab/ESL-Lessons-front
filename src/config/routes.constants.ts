/**
 * Single source of truth for application routes.
 * Add new feature routes here so the router and links stay in sync.
 */
export const APP_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  ALL_LESSONS: '/lessons',
  FREE_LESSONS: '/lessons/free',
  LESSON_CATEGORY: '/lessons/category/:slug',
  GRAMMAR_INDEX: '/grammar-index',
  // Resources (navbar dropdown)
  GOOGLE_SLIDES: '/resources/google-slides',
  TEACHING_IDEAS: '/resources/teaching-ideas',
  // Support / legal
  FAQ: '/faq',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',
} as const

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES]

/** Build a concrete category page path from its slug. */
export const lessonCategoryPath = (slug: string) => `/lessons/category/${slug}`
