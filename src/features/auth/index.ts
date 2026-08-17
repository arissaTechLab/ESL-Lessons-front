// 📤 Public API of the `auth` feature.
export { LoginPage, SignUpPage, ForgotPasswordPage } from './pages'
export { ProtectedRoute } from './components'
export { authService } from './services/auth.service'
export type { AuthUser, UserRole } from './types/auth.types'
