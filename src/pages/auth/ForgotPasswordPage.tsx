import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { requestPasswordReset } from '@/api/auth'
import { ROUTES } from '@/lib/constants'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const mutation = useMutation({
    mutationFn: () => requestPasswordReset(email),
    onSuccess: () => {
      setSubmitted(true)
    },
    onError: () => {
      // Don't reveal if email exists or not for security
      // Just show success message anyway
      setSubmitted(true)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    mutation.mutate()
  }

  if (submitted) {
    return (
      <div className="w-full max-w-md">
        <div className="p-8 bg-white rounded-2xl shadow-soft-lg border border-border text-center">
          <div className="w-16 h-16 mx-auto bg-sage-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-sage-600" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Check Your Email
          </h1>
          <p className="mt-4 text-muted-foreground">
            If an account exists for <strong>{email}</strong>, we've sent password reset instructions to that address.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <div className="mt-8 space-y-3">
            <button
              onClick={() => {
                setSubmitted(false)
                setEmail('')
              }}
              className="w-full btn-elegant-outline"
            >
              Try Another Email
            </button>
            <Link
              to={ROUTES.LOGIN}
              className="block w-full btn-elegant-primary text-center"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="p-8 bg-white rounded-2xl shadow-soft-lg border border-border">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>

        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto bg-blush-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-blush-600" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Forgot Password?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full btn-elegant-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Sending...
              </span>
            ) : (
              'Send Reset Instructions'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
