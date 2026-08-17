import { useId, useState, type FormEvent } from 'react'
import { Button, ConfirmDialog, Modal } from '@/shared/components'
import { useToastStore } from '@/store/toast.store'
import { ApiError } from '@/service'
import { adminRevenueService } from '@/features/admin-revenue/services/admin-revenue.service'
import type { PaypalState } from '@/features/admin-revenue/types/admin-revenue.types'

interface PaypalCardProps {
  paypal: PaypalState
  /** Called after a successful connect/disconnect so the page can refetch. */
  onChanged: () => void
}

/** PayPal connection panel: connect via a modal, disconnect behind a confirm. */
export function PaypalCard({ paypal, onChanged }: PaypalCardProps) {
  const formId = useId()
  const notify = useToastStore((state) => state.notify)

  const [isConnectOpen, setConnectOpen] = useState(false)
  const [isDisconnectOpen, setDisconnectOpen] = useState(false)
  const [accountEmail, setAccountEmail] = useState('')
  const [isBusy, setBusy] = useState(false)

  const fail = (error: unknown, fallback: string) =>
    notify(error instanceof ApiError ? error.message : fallback, 'error')

  const handleConnect = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    try {
      await adminRevenueService.connectPaypal(accountEmail.trim())
      notify('PayPal account connected.')
      setConnectOpen(false)
      setAccountEmail('')
      onChanged()
    } catch (error) {
      fail(error, 'Could not connect the PayPal account. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleDisconnect = async () => {
    setBusy(true)
    try {
      await adminRevenueService.disconnectPaypal()
      notify('PayPal account disconnected.')
      setDisconnectOpen(false)
      onChanged()
    } catch (error) {
      fail(error, 'Could not disconnect the PayPal account. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-ink/10 bg-white p-5">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-lg font-bold text-ink">PayPal</h2>
          <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-xs font-medium text-ink-soft">
            {paypal.mode === 'manual' ? 'Manual mode' : 'PayPal mode'}
          </span>
        </div>
        <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
          <span
            className={`size-2 rounded-full ${paypal.connected ? 'bg-accent-600' : 'bg-ink/20'}`}
            aria-hidden="true"
          />
          {paypal.connected
            ? `Connected as ${paypal.accountEmail ?? 'unknown account'}`
            : 'Not connected — payments are recorded manually.'}
        </p>
      </div>

      {paypal.connected ? (
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => setDisconnectOpen(true)}
        >
          Disconnect
        </Button>
      ) : (
        <Button size="sm" onClick={() => setConnectOpen(true)}>
          Connect PayPal
        </Button>
      )}

      <Modal
        isOpen={isConnectOpen}
        title="Connect PayPal"
        onClose={() => setConnectOpen(false)}
        footer={
          <>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setConnectOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" form={formId} disabled={isBusy}>
              {isBusy ? 'Connecting…' : 'Connect'}
            </Button>
          </>
        }
      >
        <form id={formId} onSubmit={handleConnect}>
          <label className="block text-sm font-medium text-ink" htmlFor={`${formId}-email`}>
            PayPal account email
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            required
            value={accountEmail}
            onChange={(event) => setAccountEmail(event.target.value)}
            placeholder="payments@your-business.com"
            className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink transition placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <p className="mt-2 text-xs text-ink-muted">
            Incoming PayPal payments will be matched to this account.
          </p>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDisconnectOpen}
        title="Disconnect PayPal"
        message={
          <>
            Disconnect <strong>{paypal.accountEmail ?? 'this account'}</strong>?
            New payments will stop being matched until you connect again.
          </>
        }
        confirmLabel="Disconnect"
        isBusy={isBusy}
        onConfirm={handleDisconnect}
        onCancel={() => setDisconnectOpen(false)}
      />
    </section>
  )
}
