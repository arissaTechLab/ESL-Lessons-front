import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout, AppLayout, RootLayout } from '@/layout'
import { APP_ROUTES } from '@/config/routes.constants'
import { LandingPage } from '@/features/landing'
import { AboutPage } from '@/features/about'
import {
  AllLessonsPage,
  CategoryPage,
  FreeLessonsPage,
  LessonDetailPage,
} from '@/features/lessons'
import { GrammarIndexPage } from '@/features/grammar'
import { PricingPage } from '@/features/pricing'
import { ForStudentsPage } from '@/features/students'
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
import { MaterialDetailPage, MaterialsPage } from '@/features/materials'
import { AccountPage } from '@/features/account'
import { AdminDashboardPage } from '@/features/admin-dashboard'
import { AdminLessonFormPage, AdminLessonsPage } from '@/features/admin-lessons'
import { TaxonomyPage } from '@/features/admin-taxonomy'
import { AdminBlogFormPage, AdminBlogPage } from '@/features/admin-blog'
import { AdminClientsPage } from '@/features/admin-clients'
import { AdminRevenuePage } from '@/features/admin-revenue'

/**
 * Application router. Each feature plugs its pages in here through its
 * public API. Add new routes alongside `APP_ROUTES` in config first.
 *
 * Three shells: RootLayout (public), AppLayout (client) and AdminLayout, the
 * last two behind `ProtectedRoute` so an anonymous visitor never reaches them.
 */
export const router = createBrowserRouter([
  {
    path: APP_ROUTES.HOME,
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: APP_ROUTES.ABOUT, element: <AboutPage /> },
      // Catalogue
      { path: APP_ROUTES.LESSONS, element: <AllLessonsPage /> },
      { path: APP_ROUTES.LESSON_DETAIL, element: <LessonDetailPage /> },
      { path: APP_ROUTES.CATEGORY, element: <CategoryPage /> },
      { path: APP_ROUTES.FREE_LESSONS, element: <FreeLessonsPage /> },
      { path: APP_ROUTES.GRAMMAR_INDEX, element: <GrammarIndexPage /> },
      { path: APP_ROUTES.PRICING, element: <PricingPage /> },
      { path: APP_ROUTES.FOR_STUDENTS, element: <ForStudentsPage /> },
      // Resources
      { path: APP_ROUTES.GOOGLE_SLIDES, element: <GoogleSlidesTutorialPage /> },
      { path: APP_ROUTES.TEACHING_IDEAS, element: <TeachingIdeasPage /> },
      // Support / legal
      { path: APP_ROUTES.FAQ, element: <FaqPage /> },
      { path: APP_ROUTES.PRIVACY_POLICY, element: <PrivacyPolicyPage /> },
      { path: APP_ROUTES.TERMS_OF_SERVICE, element: <TermsOfServicePage /> },
    ],
  },

  // Auth pages render standalone (no navbar/footer).
  { path: APP_ROUTES.LOGIN, element: <LoginPage /> },
  { path: APP_ROUTES.SIGNUP, element: <SignUpPage /> },
  { path: APP_ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },

  // Client zone — any signed-in user.
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: APP_ROUTES.APP, element: <MaterialsPage /> },
      { path: APP_ROUTES.APP_MATERIAL, element: <MaterialDetailPage /> },
      { path: APP_ROUTES.APP_ACCOUNT, element: <AccountPage /> },
    ],
  },

  // Admin panel — admins only.
  {
    element: (
      <ProtectedRoute allow={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: APP_ROUTES.ADMIN, element: <AdminDashboardPage /> },
      { path: APP_ROUTES.ADMIN_LESSONS, element: <AdminLessonsPage /> },
      { path: APP_ROUTES.ADMIN_LESSON_NEW, element: <AdminLessonFormPage /> },
      { path: APP_ROUTES.ADMIN_LESSON_EDIT, element: <AdminLessonFormPage /> },
      { path: APP_ROUTES.ADMIN_TAXONOMY, element: <TaxonomyPage /> },
      { path: APP_ROUTES.ADMIN_BLOG, element: <AdminBlogPage /> },
      { path: APP_ROUTES.ADMIN_BLOG_NEW, element: <AdminBlogFormPage /> },
      { path: APP_ROUTES.ADMIN_BLOG_EDIT, element: <AdminBlogFormPage /> },
      { path: APP_ROUTES.ADMIN_CLIENTS, element: <AdminClientsPage /> },
      { path: APP_ROUTES.ADMIN_REVENUE, element: <AdminRevenuePage /> },
    ],
  },
])
