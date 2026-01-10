import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layouts
import PublicLayout from '@/components/layout/PublicLayout'
import PortalLayout from '@/components/layout/PortalLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import LoadingSpinner from '@/components/common/LoadingSpinner'

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/public/HomePage'))
const AboutPage = lazy(() => import('@/pages/public/AboutPage'))
const ClassesPage = lazy(() => import('@/pages/public/ClassesPage'))
const SchedulePage = lazy(() => import('@/pages/public/SchedulePage'))
const InstructorsPage = lazy(() => import('@/pages/public/InstructorsPage'))
const PricingPage = lazy(() => import('@/pages/public/PricingPage'))
const ContactPage = lazy(() => import('@/pages/public/ContactPage'))
const TrialBookingPage = lazy(() => import('@/pages/public/TrialBookingPage'))
const FAQPage = lazy(() => import('@/pages/public/FAQPage'))

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'))
const AuthCallback = lazy(() => import('@/pages/auth/AuthCallback'))

const DashboardPage = lazy(() => import('@/pages/portal/DashboardPage'))
const BookingsPage = lazy(() => import('@/pages/portal/BookingsPage'))
const BookSchedulePage = lazy(() => import('@/pages/portal/BookSchedulePage'))
const MembershipPage = lazy(() => import('@/pages/portal/MembershipPage'))
const InvoicesPage = lazy(() => import('@/pages/portal/InvoicesPage'))
const ProfilePage = lazy(() => import('@/pages/portal/ProfilePage'))

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Suspense wrapper for lazy-loaded pages
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>{children}</Suspense>
)

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'about',
        element: (
          <SuspenseWrapper>
            <AboutPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'classes',
        element: (
          <SuspenseWrapper>
            <ClassesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'schedule',
        element: (
          <SuspenseWrapper>
            <SchedulePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'instructors',
        element: (
          <SuspenseWrapper>
            <InstructorsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'pricing',
        element: (
          <SuspenseWrapper>
            <PricingPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'contact',
        element: (
          <SuspenseWrapper>
            <ContactPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'trial',
        element: (
          <SuspenseWrapper>
            <TrialBookingPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'faq',
        element: (
          <SuspenseWrapper>
            <FAQPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // Auth routes
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <SuspenseWrapper>
            <ForgotPasswordPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <SuspenseWrapper>
            <ResetPasswordPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'auth/callback',
        element: (
          <SuspenseWrapper>
            <AuthCallback />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // Protected portal routes
  {
    path: '/portal',
    element: (
      <ProtectedRoute>
        <PortalLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'bookings',
        element: (
          <SuspenseWrapper>
            <BookingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'schedule',
        element: (
          <SuspenseWrapper>
            <BookSchedulePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'membership',
        element: (
          <SuspenseWrapper>
            <MembershipPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'invoices',
        element: (
          <SuspenseWrapper>
            <InvoicesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'profile',
        element: (
          <SuspenseWrapper>
            <ProfilePage />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // 404
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
])
