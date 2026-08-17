import {
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import { AsyncSection, Button, buttonVariants } from '@/shared/components'
import { useAsync } from '@/hooks'
import { ApiError } from '@/service'
import { useAuthStore } from '@/store/auth.store'
import { useToastStore } from '@/store/toast.store'
import type { AuthUser } from '@/features/auth'
import type { Subscription } from '@/features/account/types/account.types'
import { accountService } from '@/features/account/services/account.service'

/** Backend password policy, checked client-side before the request. */
const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

/** Picks the backend validation message that mentions the given field, if any. */
function fieldError(details: string[], field: string): string | null {
  return (
    details.find((message) =>
      message.toLowerCase().includes(field.toLowerCase()),
    ) ?? null
  )
}

function SettingsCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-ink/10 bg-white p-6">
      <h2 className="font-heading text-lg font-bold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string | null
}

function TextField({ label, error, ...props }: TextFieldProps) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-ink">{label}</span>
      <input
        aria-invalid={error ? true : undefined}
        className={`mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink transition placeholder:text-ink-muted focus:outline-none focus:ring-1 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
            : 'border-ink/15 focus:border-brand-500 focus:ring-brand-500'
        }`}
        {...props}
      />
      {error && (
        <span role="alert" className="mt-1 block text-xs text-red-600">
          {error}
        </span>
      )}
    </label>
  )
}

function FormBanner({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </p>
  )
}

function DetailsForm({ user }: { user: AuthUser }) {
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [email, setEmail] = useState(user.email)
  const [details, setDetails] = useState<string[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setDetails([])
    setFormError(null)
    setIsSaving(true)

    try {
      await accountService.updateProfile({ firstName, lastName, email })
      useToastStore.getState().notify('Profile updated')
      // Re-pull the session user so the avatar initials match the new name.
      await useAuthStore.getState().restore()
    } catch (caught) {
      if (caught instanceof ApiError && caught.details.length > 0) {
        setDetails(caught.details)
      } else if (caught instanceof ApiError) {
        setFormError(caught.message)
      } else {
        setFormError('Could not save your details. Please try again.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SettingsCard title="Your details">
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="space-y-4"
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="First name"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            error={fieldError(details, 'firstName')}
          />
          <TextField
            label="Last name"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            error={fieldError(details, 'lastName')}
          />
        </div>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldError(details, 'email')}
        />

        <FormBanner message={formError} />

        <Button type="submit" size="sm" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save details'}
        </Button>
      </form>
    </SettingsCard>
  )
}

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [currentError, setCurrentError] = useState<string | null>(null)
  const [newError, setNewError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setCurrentError(null)
    setNewError(null)
    setFormError(null)

    if (!PASSWORD_RULE.test(newPassword)) {
      setNewError('Use at least 8 characters with a letter and a number.')
      return
    }

    setIsSaving(true)
    try {
      await accountService.changePassword({ currentPassword, newPassword })
      useToastStore.getState().notify('Password updated')
      setCurrentPassword('')
      setNewPassword('')
    } catch (caught) {
      if (caught instanceof ApiError && caught.details.length > 0) {
        const current = fieldError(caught.details, 'currentPassword')
        const next = fieldError(caught.details, 'newPassword')
        setCurrentError(current)
        setNewError(next)
        // The backend's password-strength rule doesn't name a field
        // ("Password must be at least 8 characters…") — without this
        // fallback the form would fail with no feedback at all.
        if (!current && !next) setFormError(caught.details[0] ?? caught.message)
      } else if (caught instanceof ApiError) {
        // "Current password is incorrect" belongs next to its field.
        if (/current/i.test(caught.message)) setCurrentError(caught.message)
        else setFormError(caught.message)
      } else {
        setFormError('Could not change your password. Please try again.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SettingsCard title="Password">
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="space-y-4"
        noValidate
      >
        <TextField
          label="Current password"
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          error={currentError}
        />
        <TextField
          label="New password"
          type="password"
          autoComplete="new-password"
          required
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          error={newError}
        />
        <p className="text-xs text-ink-muted">
          At least 8 characters, with a letter and a number.
        </p>

        <FormBanner message={formError} />

        <Button type="submit" size="sm" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Change password'}
        </Button>
      </form>
    </SettingsCard>
  )
}

const STATUS_STYLES: Record<Subscription['status'], string> = {
  active: 'bg-accent-200 text-accent-800',
  pending: 'bg-brand-500/15 text-brand-600',
  expired: 'bg-ink/10 text-ink-soft',
  cancelled: 'bg-red-100 text-red-700',
}

function SubscriptionCard({
  subscription,
}: {
  subscription: Subscription | null
}) {
  if (!subscription) {
    return (
      <SettingsCard title="Subscription">
        <p className="text-sm text-ink-soft">
          You’re on a <strong className="text-ink">free account</strong>.
          Subscribe to unlock the full library and downloads.
        </p>
        <Link
          to={APP_ROUTES.PRICING}
          className={buttonVariants('primary', 'sm', 'mt-4')}
        >
          Subscribe
        </Link>
      </SettingsCard>
    )
  }

  return (
    <SettingsCard title="Subscription">
      <dl className="space-y-2.5 text-sm text-ink-soft">
        <div className="flex items-center gap-2">
          <dt className="font-medium text-ink">Plan:</dt>
          <dd>
            {subscription.plan === '6-months' ? '6 months' : '12 months'} —{' '}
            {subscription.price} {subscription.currency}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="font-medium text-ink">Status:</dt>
          <dd>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[subscription.status]}`}
            >
              {subscription.status}
            </span>
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="font-medium text-ink">Renews on:</dt>
          <dd>
            {new Date(subscription.renewsAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </dd>
        </div>
      </dl>
    </SettingsCard>
  )
}

/** Account settings: profile details, password and the subscription summary. */
export function AccountPage() {
  const state = useAsync((signal) => accountService.find(signal), [])

  return (
    <>
      <h1 className="font-heading text-3xl font-extrabold text-ink">
        Account &amp; subscription
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Your details, password and plan — each section saves on its own.
      </p>

      <div className="mt-8 max-w-2xl">
        <AsyncSection
          state={state}
          isEmpty={() => false}
          skeleton={
            <div className="space-y-6" aria-hidden="true">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-xl bg-accent-100"
                />
              ))}
            </div>
          }
        >
          {(account) => (
            <div className="space-y-6">
              <DetailsForm user={account.user} />
              <PasswordForm />
              <SubscriptionCard subscription={account.subscription} />
            </div>
          )}
        </AsyncSection>
      </div>
    </>
  )
}
