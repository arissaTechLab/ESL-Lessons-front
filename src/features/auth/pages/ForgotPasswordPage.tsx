import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import { ApiError } from '@/service'
import {
  AuthLayout,
  AuthTextField,
  FormError,
  SubmitButton,
} from '@/features/auth/components'
import { authService } from '@/features/auth/services/auth.service'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await authService.forgotPassword(email)
      // The API answers 202 whether or not the address exists, so the
      // confirmation is deliberately non-committal.
      setIsSent(true)
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
    <AuthLayout>
      <h1 className="font-heading text-4xl font-extrabold text-ink">
        Forgot password
      </h1>

      {isSent ? (
        <p className="mt-6 rounded-lg border border-accent-300 bg-accent-50 px-4 py-4 text-sm text-ink-soft">
          If an account exists for <strong>{email}</strong>, a reset link is on
          its way.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          <p className="text-sm text-ink-soft">
            Enter your email and we’ll send you a link to set a new password.
          </p>

          <AuthTextField
            label="Email Address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <FormError message={error} />

          <div className="pt-2">
            <SubmitButton isLoading={isSubmitting} loadingLabel="Sending…">
              Send reset link
            </SubmitButton>
          </div>
        </form>
      )}

      <p className="mt-5 text-sm text-ink-soft">
        Remembered it?{' '}
        <Link
          to={APP_ROUTES.LOGIN}
          className="font-semibold text-brand-600 transition hover:text-brand-700"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
