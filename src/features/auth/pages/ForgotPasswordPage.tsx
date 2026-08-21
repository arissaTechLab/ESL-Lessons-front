import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import {
  AuthLayout,
  AuthTextField,
  SubmitButton,
} from '@/features/auth/components'
import { ApiError } from '@/service'
import { authService } from '@/features/auth/services/auth.service'
import { isValidEmail } from '@/features/auth/lib/validation'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!email.trim()) {
      setError('Enter your email.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email.')
      return
    }
    setError(undefined)
    setIsSubmitting(true)

    try {
      await authService.forgotPassword(email)
      // The API answers 202 whether or not the address exists, so the
      // confirmation below is deliberately non-committal.
      setSent(true)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Could not send the reset link. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout imageSrc="/login-img.webp">
      <h1 className="font-heading text-4xl font-extrabold text-ink">
        Reset password
      </h1>

      {sent ? (
        <>
          <p className="mt-4 text-sm text-ink-soft">
            If an account exists for{' '}
            <span className="font-semibold text-ink">{email}</span>, we’ve sent a
            password reset link. Check your inbox.
          </p>
          <Link
            to={APP_ROUTES.LOGIN}
            className="mt-6 inline-block text-sm font-semibold text-brand-600 transition hover:text-brand-700"
          >
            ← Back to log in
          </Link>
        </>
      ) : (
        <>
          <p className="mt-3 text-sm text-ink-soft">
            Enter your email and we’ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <AuthTextField
              label="Email Address"
              type="email"
              autoComplete="email"
              value={email}
              error={error}
              onChange={(event) => {
                setEmail(event.target.value)
                if (error) setError(undefined)
              }}
            />
            <div className="pt-2">
              <SubmitButton isLoading={isSubmitting} loadingLabel="Sending…">
                Send reset link
              </SubmitButton>
            </div>
          </form>

          <p className="mt-5 text-sm text-ink-soft">
            Remembered it?{' '}
            <Link
              to={APP_ROUTES.LOGIN}
              className="font-semibold text-brand-600 transition hover:text-brand-700"
            >
              Log in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  )
}
