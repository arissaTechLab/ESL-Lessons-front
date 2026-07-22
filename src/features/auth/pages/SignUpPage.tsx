import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import {
  AuthLayout,
  AuthTextField,
  SubmitButton,
} from '@/features/auth/components'

export function SignUpPage() {
  // Mocked — wiring to the backend comes later.
  const handleSubmit = (event: FormEvent) => event.preventDefault()

  return (
    <AuthLayout>
      <h1 className="font-heading text-4xl font-extrabold text-ink">Sign up</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <AuthTextField label="First Name:" type="text" autoComplete="given-name" />
        <AuthTextField
          label="Last Name:"
          type="text"
          autoComplete="family-name"
        />
        <AuthTextField
          label="Email Address:"
          type="email"
          autoComplete="email"
        />
        <AuthTextField
          label="Create Password:"
          type="password"
          autoComplete="new-password"
        />

        <label className="flex items-center justify-center gap-2 pt-1 text-sm text-ink-soft">
          <input type="checkbox" className="size-4 accent-brand-600" />
          I agree to the terms and privacy policy
        </label>

        <div className="pt-2">
          <SubmitButton>Create my account</SubmitButton>
        </div>
      </form>

      <p className="mt-5 text-sm text-ink-soft">
        Already a member?{' '}
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
