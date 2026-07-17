import type { ButtonHTMLAttributes } from 'react'
import {
  buttonVariants,
  type ButtonVariant,
  type ButtonSize,
} from './button-variants'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

/**
 * Site-wide button. Renders a real `<button>`; for navigation, apply
 * {@link buttonVariants} to a `<Link>`/`<a>` instead.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonVariants(variant, size, className)}
      {...props}
    />
  )
}
