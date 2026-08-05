import { useId, useState, type FormEvent, type InputHTMLAttributes } from 'react'
import { buttonVariants } from '@/shared/components'
import { CURRENT_USER, formatUserDate } from '@/features/client/data/account'

const CONTROL =
  'w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'

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

export function AccountPage() {
  const [saved, setSaved] = useState('')

  const flash = (message: string) => {
    setSaved(message)
    setTimeout(() => setSaved(''), 2500)
  }

  const onSubmit = (message: string) => (event: FormEvent) => {
    event.preventDefault()
    flash(message) // Mock — persistence comes with the backend.
  }

  const active = CURRENT_USER.planStatus === 'active'

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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Card title="Your details">
          <form
            onSubmit={onSubmit('Details saved.')}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="First name"
                defaultValue={CURRENT_USER.firstName}
              />
              <Field label="Last name" defaultValue={CURRENT_USER.lastName} />
            </div>
            <Field
              label="Email"
              type="email"
              defaultValue={CURRENT_USER.email}
            />
            <button type="submit" className={buttonVariants('primary', 'sm')}>
              Save details
            </button>
          </form>
        </Card>

        {/* Password */}
        <Card
          title="Password"
          description="Choose a strong password you don’t use elsewhere."
        >
          <form onSubmit={onSubmit('Password updated.')} className="space-y-4">
            <Field label="Current password" type="password" />
            <Field label="New password" type="password" />
            <Field label="Confirm new password" type="password" />
            <button type="submit" className={buttonVariants('primary', 'sm')}>
              Update password
            </button>
          </form>
        </Card>

        {/* Subscription */}
        <Card title="Subscription" description="Your current plan.">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-heading text-xl font-bold text-ink">
              {CURRENT_USER.plan}
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
                {formatUserDate(CURRENT_USER.memberSince)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>{active ? 'Renews on' : 'Expired on'}</dt>
              <dd className="text-ink">
                {formatUserDate(CURRENT_USER.renewsAt)}
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
        </Card>
      </div>

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
