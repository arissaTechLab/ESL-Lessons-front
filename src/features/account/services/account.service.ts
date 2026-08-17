import { http } from '@/service'
import type { AuthUser } from '@/features/auth'
import type {
  AccountSummary,
  ChangePasswordPayload,
  UpdateProfilePayload,
} from '@/features/account/types/account.types'

/** Profile, password and subscription for the signed-in client. */
export const accountService = {
  find: (signal?: AbortSignal) =>
    http.get<AccountSummary>('/me/account', { signal }),

  updateProfile: (payload: UpdateProfilePayload) =>
    http.patch<AuthUser>('/me/account', payload),

  changePassword: (payload: ChangePasswordPayload) =>
    http.patch<void>('/me/account/password', payload),
}
