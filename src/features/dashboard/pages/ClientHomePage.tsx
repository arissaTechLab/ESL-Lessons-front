import { AsyncSection } from '@/shared/components'
import { useAsync } from '@/hooks'
import { useAuthStore } from '@/store/auth.store'
import { LessonCard } from '@/features/lessons'
import { ZoneShell } from '@/features/dashboard/components'
import { dashboardService } from '@/features/dashboard/services/dashboard.service'

function SubscriptionBanner() {
  const state = useAsync((signal) => dashboardService.subscription(signal), [])

  if (state.isLoading || state.error) return null

  const subscription = state.data

  return (
    <div className="mb-8 rounded-xl border border-ink/10 bg-white px-5 py-4 text-sm">
      {subscription ? (
        <p className="text-ink-soft">
          <strong className="text-ink">
            {subscription.plan === '6-months' ? '6 months' : '12 months'}
          </strong>{' '}
          plan — <span className="capitalize">{subscription.status}</span>. Renews
          on {new Date(subscription.renewsAt).toLocaleDateString('en-US')}.
        </p>
      ) : (
        <p className="text-ink-soft">
          You’re on a <strong className="text-ink">free account</strong>. Subscribe
          to unlock the full library.
        </p>
      )}
    </div>
  )
}

/**
 * The client's Materials screen. Full tabs, search and folder chips from the
 * functional guide are still to be built — this renders the real library.
 */
export function ClientHomePage() {
  const user = useAuthStore((state) => state.user)
  const state = useAsync((signal) => dashboardService.materials({ limit: 12 }, signal), [])

  return (
    <ZoneShell
      title={`Welcome back, ${user?.firstName ?? 'there'}`}
      subtitle="Every lesson in the library, ready to teach."
    >
      <SubscriptionBanner />

      <AsyncSection
        state={state}
        isEmpty={(page) => page.items.length === 0}
        empty={
          <p className="py-10 text-center text-sm text-ink-muted">
            No lessons have been published yet.
          </p>
        }
      >
        {(page) => (
          <>
            <p className="mb-4 text-sm text-ink-muted">
              {page.total} {page.total === 1 ? 'lesson' : 'lessons'}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {page.items.map((material) => (
                <LessonCard key={material.id} lesson={material} />
              ))}
            </div>
          </>
        )}
      </AsyncSection>
    </ZoneShell>
  )
}
