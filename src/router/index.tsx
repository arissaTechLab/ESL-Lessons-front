import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layout'
import { APP_ROUTES } from '@/config/routes.constants'
import { LandingPage } from '@/features/landing'
import { AboutPage } from '@/features/about'
import {
  GoogleSlidesTutorialPage,
  TeachingIdeasPage,
} from '@/features/resources'
import { FaqPage } from '@/features/faq'
import { PrivacyPolicyPage, TermsOfServicePage } from '@/features/legal'
import {
  ForgotPasswordPage,
  LoginPage,
  ProtectedRoute,
  SignUpPage,
} from '@/features/auth'
import { AdminHomePage, ClientHomePage } from '@/features/dashboard'

/**
 * Application router. Each feature plugs its pages in here through its
 * public API. Add new routes alongside `APP_ROUTES` in config first.
 */
export const router = createBrowserRouter([
  {
    path: APP_ROUTES.HOME,
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: APP_ROUTES.ABOUT, element: <AboutPage /> },
      { path: APP_ROUTES.GOOGLE_SLIDES, element: <GoogleSlidesTutorialPage /> },
      { path: APP_ROUTES.TEACHING_IDEAS, element: <TeachingIdeasPage /> },
      { path: APP_ROUTES.FAQ, element: <FaqPage /> },
      { path: APP_ROUTES.PRIVACY_POLICY, element: <PrivacyPolicyPage /> },
      { path: APP_ROUTES.TERMS_OF_SERVICE, element: <TermsOfServicePage /> },
    ],
  },
  // Auth pages render standalone (no navbar/footer).
  { path: APP_ROUTES.LOGIN, element: <LoginPage /> },
  { path: APP_ROUTES.SIGNUP, element: <SignUpPage /> },
  { path: APP_ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },

  // Private zones — guarded by role, each with its own chrome.
  {
    path: APP_ROUTES.APP,
    element: (
      <ProtectedRoute>
        <ClientHomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: APP_ROUTES.ADMIN,
    element: (
      <ProtectedRoute allow={['admin']}>
        <AdminHomePage />
      </ProtectedRoute>
    ),
  },
])
