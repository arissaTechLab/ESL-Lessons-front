/**
 * Single source of truth for application routes.
 * Add new feature routes here so the router and links stay in sync.
 */
export const APP_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  ALL_LESSONS: '/lessons',
  FOR_STUDENTS: '/for-students',
  FREE_LESSONS: '/lessons/free',
  LESSON_CATEGORY: '/lessons/category/:slug',
  LESSON_DETAIL: '/lesson/:slug',
  GRAMMAR_INDEX: '/grammar-index',
  PRICING: '/pricing',
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
  // Client zone (logged-in customer)
  CLIENT_MATERIALS: '/app',
  CLIENT_MATERIAL_DETAIL: '/app/materials/:slug',
  CLIENT_ACCOUNT: '/app/account',
  // Admin
  ADMIN: '/admin',
  ADMIN_LESSONS: '/admin/lessons',
  ADMIN_TAXONOMY: '/admin/taxonomy',
  ADMIN_LESSON_NEW: '/admin/lessons/new',
  ADMIN_LESSON_EDIT: '/admin/lessons/:id/edit',
  ADMIN_BLOG: '/admin/blog',
  ADMIN_BLOG_NEW: '/admin/blog/new',
  ADMIN_BLOG_EDIT: '/admin/blog/:id/edit',
  ADMIN_CLIENTS: '/admin/clients',
  ADMIN_REVENUE: '/admin/revenue',
} as const

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES]

/** Build a concrete category page path from its slug. */
export const lessonCategoryPath = (slug: string) => `/lessons/category/${slug}`

/** Build a concrete lesson detail path from its id/slug. */
export const lessonPath = (slug: string) => `/lesson/${slug}`

/** Build the admin edit path for a lesson. */
export const adminLessonEditPath = (id: string) => `/admin/lessons/${id}/edit`

/** Build the client-zone material detail path from a lesson id. */
export const clientMaterialPath = (slug: string) => `/app/materials/${slug}`

/** Build the admin edit path for a blog post. */
export const adminBlogEditPath = (id: string) => `/admin/blog/${id}/edit`
