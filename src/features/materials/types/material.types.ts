import type { LessonCardModel, LessonDetail } from '@/features/lessons'

/** A lesson tile in the client's library, stamped with its folder. */
export interface Material extends LessonCardModel {
  folderId: string | null
}

/** Full lesson record for the client detail page. */
export interface MaterialDetail extends LessonDetail {
  folderId: string | null
}

export interface Folder {
  id: string
  name: string
  count: number
}

/** Response of `GET /api/me/folders` — the chip row needs the two virtual counts too. */
export interface FolderList {
  folders: Folder[]
  uncategorizedCount: number
  allCount: number
}

export type MaterialTab = 'all' | 'free' | 'paid'

/** Query accepted by `GET /api/me/materials`. `folder` is an id or `'uncategorized'`. */
export interface MaterialFilters {
  q?: string
  tab?: MaterialTab
  folder?: string
  page?: number
  limit?: number
}

export type DownloadKind = 'slides' | 'pdf'
