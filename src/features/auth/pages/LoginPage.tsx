import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import { ApiError } from '@/service'
import { useAuthStore } from '@/store/auth.store'
import {
  AuthLayout,
  AuthTextField,
  FormError,
  SubmitButton,
} from '@/features/auth/components'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const user = await login({ email, password })
      // The role decides the destination: admins manage, clients consume.
      navigate(user.role === 'admin' ? APP_ROUTES.ADMIN : APP_ROUTES.APP, {
        replace: true,
      })
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Could not sign you in. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-heading text-4xl font-extrabold text-ink">Log in</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <AuthTextField
          label="Email Address"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <AuthTextField
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="flex justify-end">
          <Link
            to={APP_ROUTES.FORGOT_PASSWORD}
            className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
          >
            Forgot password?
          </Link>
        </div>

        <FormError message={error} />

        <div className="pt-2">
          <SubmitButton isLoading={isSubmitting} loadingLabel="Signing in…">
            Log in
          </SubmitButton>
        </div>
      </form>

      <p className="mt-5 text-sm text-ink-soft">
        Don’t have an account?{' '}
        <Link
          to={APP_ROUTES.SIGNUP}
          className="font-semibold text-brand-600 transition hover:text-brand-700"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
