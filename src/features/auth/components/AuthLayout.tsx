import type { ReactNode } from 'react'
import { Placeholder } from '@/shared/components'

interface AuthLayoutProps {
  children: ReactNode
  /** Optional side image; falls back to a placeholder panel. */
  imageSrc?: string
}

/**
 * Full-screen split layout for the auth pages: image on the left, form on the
 * right. Rendered outside the app shell (no navbar/footer).
 */
export function AuthLayout({ children, imageSrc }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh bg-white">
      {/* Image panel */}
      <div className="hidden w-1/2 lg:block">
        {imageSrc ? (
          <img src={imageSrc} alt="" className="h-full w-full object-cover" />
        ) : (
          <Placeholder
            label="Image"
            className="h-full w-full rounded-none border-0"
          />
        )}
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center px-6 py-12 sm:px-10 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
