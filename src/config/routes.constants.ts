/**
 * Single source of truth for application routes.
 * Add new feature routes here so the router and links stay in sync.
 */
export const APP_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  // Public catalogue
  LESSONS: '/lessons',
  LESSON_DETAIL: '/lessons/:slug',
  CATEGORY: '/categories/:slug',
  FREE_LESSONS: '/free-lessons',
  GRAMMAR_INDEX: '/grammar-index',
  PRICING: '/pricing',
  FOR_STUDENTS: '/for-students',
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
  FORGOT_PASSWORD: '/forgot-password',
  // Client zone
  APP: '/app',
  APP_MATERIAL: '/app/materials/:slug',
  APP_ACCOUNT: '/app/account',
  // Admin panel
  ADMIN: '/admin',
  ADMIN_LESSONS: '/admin/lessons',
  ADMIN_LESSON_NEW: '/admin/lessons/new',
  ADMIN_LESSON_EDIT: '/admin/lessons/:id/edit',
  ADMIN_TAXONOMY: '/admin/taxonomy',
  ADMIN_BLOG: '/admin/blog',
  ADMIN_BLOG_NEW: '/admin/blog/new',
  ADMIN_BLOG_EDIT: '/admin/blog/:id/edit',
  ADMIN_CLIENTS: '/admin/clients',
  ADMIN_REVENUE: '/admin/revenue',
} as const

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES]

/** Replaces `:param` placeholders, e.g. `path(APP_ROUTES.CATEGORY, { slug })`. */
export function path(
  route: string,
  params: Record<string, string | number>,
): string {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, String(value)),
    route,
  )
}
