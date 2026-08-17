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

export function SignUpPage() {
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = (field: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!acceptedTerms) {
      setError('Please accept the terms and privacy policy to continue.')
      return
    }

    setIsSubmitting(true)

    try {
      // Registration signs you straight in; new accounts are always clients.
      await register({ ...form, acceptedTerms })
      navigate(APP_ROUTES.APP, { replace: true })
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Could not create your account. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-heading text-4xl font-extrabold text-ink">Sign up</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <AuthTextField
          label="First Name:"
          type="text"
          autoComplete="given-name"
          required
          value={form.firstName}
          onChange={(event) => update('firstName')(event.target.value)}
        />
        <AuthTextField
          label="Last Name:"
          type="text"
          autoComplete="family-name"
          required
          value={form.lastName}
          onChange={(event) => update('lastName')(event.target.value)}
        />
        <AuthTextField
          label="Email Address:"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(event) => update('email')(event.target.value)}
        />
        <AuthTextField
          label="Create Password:"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={form.password}
          onChange={(event) => update('password')(event.target.value)}
        />
        <p className="text-xs text-ink-muted">
          At least 8 characters, including a letter and a number.
        </p>

        <label className="flex items-center justify-center gap-2 pt-1 text-sm text-ink-soft">
          <input
            type="checkbox"
            className="size-4 accent-brand-600"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
          />
          I agree to the terms and privacy policy
        </label>

        <FormError message={error} />

        <div className="pt-2">
          <SubmitButton isLoading={isSubmitting} loadingLabel="Creating…">
            Create my account
          </SubmitButton>
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
