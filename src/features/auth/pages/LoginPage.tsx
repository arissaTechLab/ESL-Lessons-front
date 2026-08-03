import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import {
  AuthLayout,
  AuthTextField,
  SubmitButton,
} from '@/features/auth/components'
import { isValidEmail } from '@/features/auth/lib/validation'

interface LoginForm {
  email: string
  password: string
}

type LoginErrors = Partial<Record<keyof LoginForm, string>>

export function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [errors, setErrors] = useState<LoginErrors>({})

  const update = <K extends keyof LoginForm>(field: K, value: LoginForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    )
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const next: LoginErrors = {}
    if (!form.email.trim()) next.email = 'Enter your email.'
    else if (!isValidEmail(form.email)) next.email = 'Enter a valid email.'
    if (!form.password) next.password = 'Enter your password.'
    setErrors(next)

    if (Object.keys(next).length === 0) {
      // Mock — any credentials are accepted; go straight to the admin panel.
      navigate(APP_ROUTES.ADMIN)
    }
  }

  return (
    <AuthLayout imageSrc="/login-img.webp">
      <h1 className="font-heading text-4xl font-extrabold text-ink">Log in</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <AuthTextField
          label="Email Address"
          type="email"
          autoComplete="email"
          value={form.email}
          error={errors.email}
          onChange={(event) => update('email', event.target.value)}
        />
        <AuthTextField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          error={errors.password}
          onChange={(event) => update('password', event.target.value)}
        />

        <div className="flex justify-end">
          <Link
            to={APP_ROUTES.FORGOT_PASSWORD}
            className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
          >
            Forgot password?
          </Link>
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
