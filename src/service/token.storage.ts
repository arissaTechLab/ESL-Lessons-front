/**
 * The single place tokens are persisted.
 *
 * Both the HTTP client and the auth store read through here, which keeps them
 * from importing each other (the client needs a token to send; the store needs
 * the client to log in).
 */

const ACCESS_KEY = 'esl.accessToken'
const REFRESH_KEY = 'esl.refreshToken'

export interface StoredTokens {
  accessToken: string
  refreshToken: string
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    // Private mode or storage disabled — behave as a logged-out visitor.
    return null
  }
}

export function getAccessToken(): string | null {
  return read(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  return read(REFRESH_KEY)
}

export function setTokens(tokens: StoredTokens): void {
  try {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken)
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
  } catch {
    // Ignore storage failures; the session simply won't survive a reload.
  }
}

export function clearTokens(): void {
  try {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  } catch {
    // Nothing to clean up.
  }
}
