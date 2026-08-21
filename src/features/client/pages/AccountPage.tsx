import { useId, useState, type FormEvent, type InputHTMLAttributes } from 'react'
import { buttonVariants } from '@/shared/components'
import { ApiError } from '@/service'
import { useAsync } from '@/hooks/useAsync'
import { AsyncSection } from '@/shared/components/AsyncSection'
import { useAuthStore } from '@/store/auth.store'
import {
  clientService,
  type Account,
} from '@/features/client/services/client.service'

const CONTROL =
  'w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'

export function formatUserDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

/** `2026-08-17T…` → `2026-08-17`, the shape `formatUserDate` expects. */
const isoDay = (value: string): string => value.split('T')[0] ?? ''

const errorMessage = (error: unknown): string =>
  error instanceof ApiError
    ? error.message
    : 'Something went wrong. Please try again.'

function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <input id={id} className={CONTROL} {...props} />
    </div>
  )
}

function Card({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-ink/10 bg-white p-6">
      <h2 className="font-heading text-lg font-bold text-ink">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-ink-soft">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  )
}

function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="text-sm font-medium text-rose-600">
      {message}
    </p>
  )
}

function DetailsCard({
  account,
  flash,
}: {
  account: Account
  flash: (message: string) => void
}) {
  const [firstName, setFirstName] = useState(account.user.firstName)
  const [lastName, setLastName] = useState(account.user.lastName)
  const [email, setEmail] = useState(account.user.email)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    try {
      await clientService.updateProfile({ firstName, lastName, email })
      flash('Details saved.')
      // Keep the topbar's account menu in sync with the new name/email.
      void useAuthStore.getState().restore()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <Card title="Your details">
      <form onSubmit={(event) => void onSubmit(event)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Field
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormError message={error} />
        <button type="submit" className={buttonVariants('primary', 'sm')}>
          Save details
        </button>
      </form>
    </Card>
  )
}

function PasswordCard({ flash }: { flash: (message: string) => void }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('The new passwords do not match.')
      return
    }
    setError(null)
    try {
      await clientService.changePassword({ currentPassword, newPassword })
      flash('Password updated.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <Card
      title="Password"
      description="Choose a strong password you don’t use elsewhere."
    >
      <form onSubmit={(event) => void onSubmit(event)} className="space-y-4">
        <Field
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Field
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Field
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <FormError message={error} />
        <button type="submit" className={buttonVariants('primary', 'sm')}>
          Update password
        </button>
      </form>
    </Card>
  )
}

function SubscriptionCard({ account }: { account: Account }) {
  const subscription = account.subscription
  const active = subscription?.status === 'active'

  return (
    <Card title="Subscription" description="Your current plan.">
      {subscription ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-heading text-xl font-bold text-ink">
              {subscription.planName}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                active
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {active ? 'Active' : 'Expired'}
            </span>
          </div>
          <dl className="mt-4 space-y-1.5 text-sm text-ink-soft">
            <div className="flex justify-between gap-4">
              <dt>Member since</dt>
              <dd className="text-ink">
                {formatUserDate(isoDay(account.user.createdAt))}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>{active ? 'Renews on' : 'Expired on'}</dt>
              <dd className="text-ink">
                {formatUserDate(isoDay(subscription.renewsAt))}
              </dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="#" className={buttonVariants('secondary', 'sm')}>
              Manage subscription
            </a>
            <a
              href="#"
              className="self-center text-sm font-medium text-ink-soft transition hover:text-rose-600"
            >
              Cancel subscription
            </a>
          </div>
        </>
      ) : (
        <p className="text-sm text-ink-soft">
          You don’t have an active subscription.
        </p>
      )}
    </Card>
  )
}

export function AccountPage() {
  const [saved, setSaved] = useState('')

  const state = useAsync((signal) => clientService.account(signal), [])

  const flash = (message: string) => {
    setSaved(message)
    setTimeout(() => setSaved(''), 2500)
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
          Account
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Your details, password and subscription.
        </p>
      </div>

      <AsyncSection state={state} isEmpty={() => false}>
        {(account) => (
          <div className="grid gap-6 lg:grid-cols-2">
            <DetailsCard account={account} flash={flash} />
            <PasswordCard flash={flash} />
            <SubscriptionCard account={account} />
          </div>
        )}
      </AsyncSection>

      {saved && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 rounded-lg bg-ink px-4 py-3 text-sm font-medium text-cream shadow-lg"
        >
          {saved}
        </div>
      )}
    </>
  )
}
