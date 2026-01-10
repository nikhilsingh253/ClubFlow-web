import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { confirmPasswordReset } from '@/api/auth'
import { ROUTES } from '@/lib/constants'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const uid = searchParams.get('uid') || ''
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  const mutation = useMutation({
    mutationFn: () => confirmPasswordReset({
      uid,
      token,
      newPassword1: password,
      newPassword2: confirmPassword,
    }),
    onSuccess: () => {
      setSuccess(true)
      toast.success('Password reset successfully!')
    },
    onError: (error: Error & { response?: { data?: { detail?: string; new_password2?: string[] } } }) => {
      const message = error.response?.data?.detail
        || error.response?.data?.new_password2?.[0]
        || 'Failed to reset password. The link may have expired.'
      toast.error(message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    mutation.mutate()
  }

  // Invalid or missing token
  if (!uid || !token) {
    return (
      <div className="w-full max-w-md">
        <div className="p-8 bg-white rounded-2xl shadow-soft-lg border border-border text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Invalid Reset Link
          </h1>
          <p className="mt-4 text-muted-foreground">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="mt-8">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="btn-elegant-primary inline-block"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="p-8 bg-white rounded-2xl shadow-soft-lg border border-border text-center">
          <div className="w-16 h-16 mx-auto bg-sage-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-sage-600" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Password Reset Complete
          </h1>
          <p className="mt-4 text-muted-foreground">
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="btn-elegant-primary w-full"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="p-8 bg-white rounded-2xl shadow-soft-lg border border-border">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto bg-blush-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-blush-600" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Set New Password
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
                placeholder="Enter new password"
                required
                minLength={8}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Must be at least 8 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full btn-elegant-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
