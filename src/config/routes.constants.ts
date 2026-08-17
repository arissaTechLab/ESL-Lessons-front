/**
 * Single source of truth for application routes.
 * Add new feature routes here so the router and links stay in sync.
 */
export const APP_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
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
  // Private zones — the login response's `role` decides which one you land on.
  APP: '/app',
  ADMIN: '/admin',
} as const

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES]
