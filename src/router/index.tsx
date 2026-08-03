import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layout'
import { APP_ROUTES } from '@/config/routes.constants'
import { LandingPage } from '@/features/landing'
import { AboutPage } from '@/features/about'
import {
  AllLessonsPage,
  CategoryLessonsPage,
  FreeLessonsPage,
  LessonDetailPage,
} from '@/features/lessons'
import { GrammarIndexPage } from '@/features/grammar'
import { PricingPage } from '@/features/pricing'
import { ForStudentsPage } from '@/features/for-students'
import {
  GoogleSlidesTutorialPage,
  TeachingIdeasPage,
} from '@/features/resources'
import { FaqPage } from '@/features/faq'
import { PrivacyPolicyPage, TermsOfServicePage } from '@/features/legal'
import { LoginPage, SignUpPage, ForgotPasswordPage } from '@/features/auth'
import {
  AdminLayout,
  AdminDashboardPage,
  AdminLessonsPage,
  AdminLessonFormPage,
  AdminBlogPage,
  AdminBlogFormPage,
  AdminClientsPage,
  AdminRevenuePage,
} from '@/features/admin'

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
      { path: APP_ROUTES.ALL_LESSONS, element: <AllLessonsPage /> },
      { path: APP_ROUTES.FREE_LESSONS, element: <FreeLessonsPage /> },
      { path: APP_ROUTES.LESSON_CATEGORY, element: <CategoryLessonsPage /> },
      { path: APP_ROUTES.LESSON_DETAIL, element: <LessonDetailPage /> },
      { path: APP_ROUTES.GRAMMAR_INDEX, element: <GrammarIndexPage /> },
      { path: APP_ROUTES.PRICING, element: <PricingPage /> },
      { path: APP_ROUTES.FOR_STUDENTS, element: <ForStudentsPage /> },
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
  // Admin area — its own shell (sidebar), separate from the public site.
  {
    path: APP_ROUTES.ADMIN,
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'lessons', element: <AdminLessonsPage /> },
      { path: 'lessons/new', element: <AdminLessonFormPage /> },
      { path: 'lessons/:id/edit', element: <AdminLessonFormPage /> },
      { path: 'blog', element: <AdminBlogPage /> },
      { path: 'blog/new', element: <AdminBlogFormPage /> },
      { path: 'blog/:id/edit', element: <AdminBlogFormPage /> },
      { path: 'clients', element: <AdminClientsPage /> },
      { path: 'revenue', element: <AdminRevenuePage /> },
    ],
  },
])
