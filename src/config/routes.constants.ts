/**
 * Single source of truth for application routes.
 * Add new feature routes here so the router and links stay in sync.
 */
export const APP_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
} as const

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES]
