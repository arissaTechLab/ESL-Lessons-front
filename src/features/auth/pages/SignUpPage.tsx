import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import {
  AuthLayout,
  AuthTextField,
  SubmitButton,
} from '@/features/auth/components'
import { isValidEmail } from '@/features/auth/lib/validation'

interface SignupForm {
  firstName: string
  lastName: string
  email: string
  password: string
  agreed: boolean
}

type SignupErrors = Partial<Record<keyof SignupForm, string>>

const INITIAL: SignupForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  agreed: false,
}

export function SignUpPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<SignupForm>(INITIAL)
  const [errors, setErrors] = useState<SignupErrors>({})

  const update = <K extends keyof SignupForm>(
    field: K,
    value: SignupForm[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    )
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const next: SignupErrors = {}
    if (!form.firstName.trim()) next.firstName = 'Enter your first name.'
    if (!form.lastName.trim()) next.lastName = 'Enter your last name.'
    if (!form.email.trim()) next.email = 'Enter your email.'
    else if (!isValidEmail(form.email)) next.email = 'Enter a valid email.'
    if (!form.password) next.password = 'Create a password.'
    else if (form.password.length < 8)
      next.password = 'Use at least 8 characters.'
    if (!form.agreed) next.agreed = 'Please accept the terms to continue.'
    setErrors(next)

    if (Object.keys(next).length === 0) {
      // Mock — account "created"; send them to log in.
      navigate(APP_ROUTES.LOGIN)
    }
  }

  return (
    <AuthLayout imageSrc="/signup-img.webp">
      <h1 className="font-heading text-4xl font-extrabold text-ink">Sign up</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <AuthTextField
          label="First Name:"
          type="text"
          autoComplete="given-name"
          value={form.firstName}
          error={errors.firstName}
          onChange={(event) => update('firstName', event.target.value)}
        />
        <AuthTextField
          label="Last Name:"
          type="text"
          autoComplete="family-name"
          value={form.lastName}
          error={errors.lastName}
          onChange={(event) => update('lastName', event.target.value)}
        />
        <AuthTextField
          label="Email Address:"
          type="email"
          autoComplete="email"
          value={form.email}
          error={errors.email}
          onChange={(event) => update('email', event.target.value)}
        />
        <AuthTextField
          label="Create Password:"
          type="password"
          autoComplete="new-password"
          value={form.password}
          error={errors.password}
          onChange={(event) => update('password', event.target.value)}
        />

        <div>
          <label className="flex items-center justify-center gap-2 pt-1 text-sm text-ink-soft">
            <input
              type="checkbox"
              className="size-4 accent-brand-600"
              checked={form.agreed}
              onChange={(event) => update('agreed', event.target.checked)}
            />
            I agree to the{' '}
            <Link
              to={APP_ROUTES.TERMS_OF_SERVICE}
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              terms
            </Link>{' '}
            and{' '}
            <Link
              to={APP_ROUTES.PRIVACY_POLICY}
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              privacy policy
            </Link>
          </label>
          {errors.agreed && (
            <p className="mt-1.5 text-center text-xs text-rose-600">
              {errors.agreed}
            </p>
          )}
        </div>

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
