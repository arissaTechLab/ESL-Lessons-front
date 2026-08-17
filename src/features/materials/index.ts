// 📤 Public API of the `materials` feature (the client's library).
export { MaterialsPage, MaterialDetailPage } from './pages'
export { materialsService } from './services/materials.service'
export type {
  Material,
  MaterialDetail,
  MaterialFilters,
  MaterialTab,
  Folder,
  FolderList,
  DownloadKind,
} from './types/material.types'
