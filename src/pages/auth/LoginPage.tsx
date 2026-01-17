import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { googleLogin, emailLogin } from '@/api/auth'
import { APP_NAME, ROUTES } from '@/lib/constants'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Get the redirect path from location state, or default to portal
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.PORTAL

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const googleMutation = useMutation({
    mutationFn: (credential: string) => googleLogin(credential),
    onSuccess: (data) => {
      login(data.user, data.access, data.refresh)
      toast.success(`Welcome, ${data.user.firstName}!`)
      navigate(from, { replace: true })
    },
    onError: () => {
      toast.error('Failed to sign in. Please try again.')
    },
  })

  const emailMutation = useMutation({
    mutationFn: () => emailLogin(email, password),
    onSuccess: (data) => {
      login(data.user, data.access, data.refresh)
      toast.success(`Welcome back, ${data.user.firstName}!`)
      navigate(from, { replace: true })
    },
    onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
      const message = error.response?.data?.detail || 'Invalid email or password'
      toast.error(message)
    },
  })

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      googleMutation.mutate(credentialResponse.credential)
    }
  }

  const handleGoogleError = () => {
    toast.error('Google sign-in was cancelled or failed.')
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter your email and password')
      return
    }
    emailMutation.mutate()
  }

  const isLoading = googleMutation.isPending || emailMutation.isPending

  return (
    <div className="w-full max-w-md">
      <div className="p-8 bg-white rounded-2xl shadow-soft-lg border border-border">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Welcome Back
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to manage your membership and book classes
          </p>
        </div>

        {isLoading ? (
          <div className="py-8 text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm text-muted-foreground">
              Signing you in...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Email/Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-sm text-blush-600 hover:text-blush-700"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full btn-elegant-primary"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-muted-foreground">or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="300"
              />
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                By signing in, you agree to our{' '}
                <Link to="/terms" className="text-blush-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blush-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-taupe-50 rounded-xl text-center">
        <p className="text-sm font-medium text-foreground mb-1">
          Not a member yet?
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          Book a trial class to get started with {APP_NAME}.
        </p>
        <Link
          to={ROUTES.TRIAL}
          className="text-sm font-medium text-blush-600 hover:text-blush-700"
        >
          Book Your Trial Class →
        </Link>
      </div>
    </div>
  )
}
