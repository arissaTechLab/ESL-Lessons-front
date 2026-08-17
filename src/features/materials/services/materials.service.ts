import { http } from '@/service'
import type { Paginated } from '@/interface'
import type {
  DownloadKind,
  Folder,
  FolderList,
  Material,
  MaterialDetail,
  MaterialFilters,
} from '@/features/materials/types/material.types'

/** The signed-in client's library and folders. Every call requires a bearer token. */
export const materialsService = {
  list: (filters: MaterialFilters = {}, signal?: AbortSignal) =>
    http.get<Paginated<Material>>('/me/materials', {
      params: { ...filters },
      signal,
    }),

  detail: (slug: string, signal?: AbortSignal) =>
    http.get<MaterialDetail>(`/me/materials/${slug}`, { signal }),

  folders: (signal?: AbortSignal) =>
    http.get<FolderList>('/me/folders', { signal }),

  createFolder: (name: string) => http.post<Folder>('/me/folders', { name }),

  /** Lessons in the deleted folder fall back to Uncategorized server-side. */
  deleteFolder: (id: string) => http.delete<void>(`/me/folders/${id}`),

  /** `folderId: null` moves the lesson back to Uncategorized. */
  assign: (lessonId: string, folderId: string | null) =>
    http.put<{ lessonId: string; folderId: string | null }>(
      '/me/folders/assign',
      { lessonId, folderId },
    ),

  /** Records the download server-side and returns the resource URL to open. */
  download: (lessonId: string, kind: DownloadKind) =>
    http.post<{ url: string }>(`/me/lessons/${lessonId}/download/${kind}`),
}
