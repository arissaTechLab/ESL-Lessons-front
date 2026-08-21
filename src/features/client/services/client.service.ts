import { http } from '@/service'
import type { Paginated } from '@/interface'
import {
  toLesson,
  toLessonDetail,
} from '@/features/lessons/services/lessons.service'
import type { Lesson, LessonDetail } from '@/features/lessons/types/lesson.types'
import type { AuthUser } from '@/features/auth/types/auth.types'

/** ---------- What the API actually sends ---------- */

/** The catalogue card/detail payloads, reused via the lessons mappers. */
type ApiLessonCard = Parameters<typeof toLesson>[0]
type ApiLessonDetail = Parameters<typeof toLessonDetail>[0]

/** Client materials are lesson cards plus the folder they are filed under. */
type ApiMaterialCard = ApiLessonCard & { folderId: string | null }
type ApiMaterialDetail = ApiLessonDetail & { folderId: string | null }

interface ApiSubscription {
  id: string
  /** Plan key (e.g. "6-months") — resolved to its display name below. */
  plan: string
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  startsAt: string
  endsAt: string
  renewsAt: string
  price: number
  currency: string
}

interface ApiAccount {
  user: AuthUser
  subscription: ApiSubscription | null
}

interface ApiPlan {
  id: string
  key: string
  name: string
}

/** ---------- What the screens consume ---------- */

export interface Material extends Lesson {
  folderId: string | null
}

export interface MaterialDetail extends LessonDetail {
  folderId: string | null
}

export interface Folder {
  id: string
  name: string
  count: number
}

export interface FoldersSummary {
  folders: Folder[]
  uncategorizedCount: number
  allCount: number
}

export interface MaterialFilters {
  q?: string
  tab?: 'all' | 'free' | 'paid'
  /** Folder id, or 'uncategorized'. Omit for all folders. */
  folder?: string
  page?: number
  limit?: number
}

export interface AccountSubscription extends ApiSubscription {
  /** Display name resolved from the pricing plans (falls back to the key). */
  planName: string
}

export interface Account {
  user: AuthUser
  subscription: AccountSubscription | null
}

export interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
  email?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

/** ---------- Mapping onto the shape the components already use ---------- */

const toMaterial = (dto: ApiMaterialCard): Material => ({
  ...toLesson(dto),
  folderId: dto.folderId,
})

/** ---------- The client zone (`/me`) ---------- */

export const clientService = {
  materials: (filters: MaterialFilters = {}, signal?: AbortSignal) =>
    http
      .get<Paginated<ApiMaterialCard>>('/me/materials', {
        params: { ...filters },
        signal,
      })
      .then((page) => ({ ...page, items: page.items.map(toMaterial) })),

  material: (slug: string, signal?: AbortSignal): Promise<MaterialDetail> =>
    http
      .get<ApiMaterialDetail>(`/me/materials/${slug}`, { signal })
      .then((dto) => ({ ...toLessonDetail(dto), folderId: dto.folderId })),

  folders: (signal?: AbortSignal) =>
    http.get<FoldersSummary>('/me/folders', { signal }),

  createFolder: (name: string) => http.post<Folder>('/me/folders', { name }),

  deleteFolder: (id: string) => http.delete<void>(`/me/folders/${id}`),

  /** File a lesson into a folder; `null` moves it back to Uncategorized. */
  assign: (lessonId: string, folderId: string | null) =>
    http.put<{ lessonId: string; folderId: string | null }>(
      '/me/folders/assign',
      { lessonId, folderId },
    ),

  /** Records the download server-side and returns the resource url. */
  download: (lessonId: string, kind: 'slides' | 'pdf') =>
    http.post<{ url: string }>(`/me/lessons/${lessonId}/download/${kind}`),

  account: async (signal?: AbortSignal): Promise<Account> => {
    const dto = await http.get<ApiAccount>('/me/account', { signal })
    const subscription = dto.subscription
    if (!subscription) return { user: dto.user, subscription: null }

    // The subscription carries the plan *key* — the pricing plans have the name.
    const plans = await http
      .get<ApiPlan[]>('/content/plans', { signal })
      .catch(() => [] as ApiPlan[])
    const planName =
      plans.find((plan) => plan.key === subscription.plan)?.name ??
      subscription.plan.replace(/-/g, ' ')

    return { user: dto.user, subscription: { ...subscription, planName } }
  },

  updateProfile: (payload: UpdateProfilePayload) =>
    http.patch<AuthUser>('/me/account', payload),

  changePassword: (payload: ChangePasswordPayload) =>
    http.patch<void>('/me/account/password', payload),
}
