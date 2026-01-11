import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layouts
import PublicLayout from '@/components/layout/PublicLayout'
import PortalLayout from '@/components/layout/PortalLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
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

// Admin pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminSchedulePage = lazy(() => import('@/pages/admin/AdminSchedulePage'))
const AdminBookingsPage = lazy(() => import('@/pages/admin/AdminBookingsPage'))
const AdminCheckInPage = lazy(() => import('@/pages/admin/AdminCheckInPage'))
const AdminCustomersPage = lazy(() => import('@/pages/admin/AdminCustomersPage'))
const AdminCustomerDetailPage = lazy(() => import('@/pages/admin/AdminCustomerDetailPage'))
const AdminCustomerNewPage = lazy(() => import('@/pages/admin/AdminCustomerNewPage'))
const AdminMembershipsPage = lazy(() => import('@/pages/admin/AdminMembershipsPage'))
const AdminTrialsPage = lazy(() => import('@/pages/admin/AdminTrialsPage'))
const AdminMessagesPage = lazy(() => import('@/pages/admin/AdminMessagesPage'))
const AdminInvoicesPage = lazy(() => import('@/pages/admin/AdminInvoicesPage'))
const AdminWaitlistPage = lazy(() => import('@/pages/admin/AdminWaitlistPage'))
const AdminRequestsPage = lazy(() => import('@/pages/admin/AdminRequestsPage'))
const AdminClassTypesPage = lazy(() => import('@/pages/admin/AdminClassTypesPage'))
const AdminMembershipPlansPage = lazy(() => import('@/pages/admin/AdminMembershipPlansPage'))
const AdminTrainersPage = lazy(() => import('@/pages/admin/AdminTrainersPage'))
const AdminStaffPage = lazy(() => import('@/pages/admin/AdminStaffPage'))
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'))
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage'))

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

  // Protected admin routes
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <AdminDashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'schedule',
        element: (
          <SuspenseWrapper>
            <AdminSchedulePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'bookings',
        element: (
          <SuspenseWrapper>
            <AdminBookingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'check-in',
        element: (
          <SuspenseWrapper>
            <AdminCheckInPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'customers',
        element: (
          <SuspenseWrapper>
            <AdminCustomersPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'customers/new',
        element: (
          <SuspenseWrapper>
            <AdminCustomerNewPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'customers/:id',
        element: (
          <SuspenseWrapper>
            <AdminCustomerDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'memberships',
        element: (
          <SuspenseWrapper>
            <AdminMembershipsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'trials',
        element: (
          <SuspenseWrapper>
            <AdminTrialsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'messages',
        element: (
          <SuspenseWrapper>
            <AdminMessagesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'invoices',
        element: (
          <SuspenseWrapper>
            <AdminInvoicesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'waitlist',
        element: (
          <SuspenseWrapper>
            <AdminWaitlistPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'requests',
        element: (
          <SuspenseWrapper>
            <AdminRequestsPage />
          </SuspenseWrapper>
        ),
      },
      // Owner-only Configuration pages
      {
        path: 'class-types',
        element: (
          <SuspenseWrapper>
            <AdminClassTypesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'plans',
        element: (
          <SuspenseWrapper>
            <AdminMembershipPlansPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'trainers',
        element: (
          <SuspenseWrapper>
            <AdminTrainersPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'staff',
        element: (
          <SuspenseWrapper>
            <AdminStaffPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'settings',
        element: (
          <SuspenseWrapper>
            <AdminSettingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'reports',
        element: (
          <SuspenseWrapper>
            <AdminReportsPage />
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
