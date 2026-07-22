import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import {
  AuthLayout,
  AuthTextField,
  SubmitButton,
} from '@/features/auth/components'

export function LoginPage() {
  // Mocked — wiring to the backend comes later.
  const handleSubmit = (event: FormEvent) => event.preventDefault()

  return (
    <AuthLayout>
      <h1 className="font-heading text-4xl font-extrabold text-ink">Log in</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <AuthTextField label="Email Address" type="email" autoComplete="email" />
        <AuthTextField
          label="Password"
          type="password"
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <a
            href="#"
            className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
          >
            Forgot password?
          </a>
        </div>

        <div className="pt-2">
          <SubmitButton>Log in</SubmitButton>
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
