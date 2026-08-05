import { create } from 'zustand'

export interface Folder {
  id: string
  name: string
}

export interface FolderAssignment {
  lessonId: string
  folderId: string
}

let folderSeq = 100

interface FoldersState {
  folders: Folder[]
  /** Which folder each lesson is filed under. No entry = uncategorized. */
  assignments: FolderAssignment[]
  createFolder: (name: string) => void
  deleteFolder: (id: string) => void
  /** File a lesson into a folder, or pass null to leave it uncategorized. */
  assign: (lessonId: string, folderId: string | null) => void
}

/**
 * How the customer organises lessons into folders. Every paid customer can
 * access every lesson, so there's no "downloaded" state — folders are purely
 * for organisation. Session-scoped mock (resets on reload) until the backend
 * is wired.
 */
export const useFoldersStore = create<FoldersState>((set) => ({
  // Seeded so the folders aren't empty on first visit.
  folders: [
    { id: 'f-speaking', name: 'Speaking practice' },
    { id: 'f-grammar', name: 'Grammar' },
  ],
  assignments: [
    { lessonId: 'space-travel', folderId: 'f-speaking' },
    { lessonId: 'remote-work', folderId: 'f-speaking' },
    { lessonId: 'climate-solutions', folderId: 'f-grammar' },
  ],

  createFolder: (name) =>
    set((state) => ({
      folders: [...state.folders, { id: `f-${(folderSeq += 1)}`, name }],
    })),

  deleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
      assignments: state.assignments.filter((a) => a.folderId !== id),
    })),

  assign: (lessonId, folderId) =>
    set((state) => {
      const rest = state.assignments.filter((a) => a.lessonId !== lessonId)
      return {
        assignments: folderId ? [...rest, { lessonId, folderId }] : rest,
      }
    }),
}))
