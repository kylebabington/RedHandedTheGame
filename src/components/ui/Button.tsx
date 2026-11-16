import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-crimson bg-crimson text-ink hover:border-crimson-bright hover:bg-crimson-bright',
  secondary:
    'border-border bg-surface text-ink hover:border-crimson hover:text-ink',
  ghost: 'border-transparent bg-transparent text-muted hover:border-border hover:text-ink',
}

const baseClasses =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border px-5 py-2.5 font-sans text-sm font-medium tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50'

type SharedProps = {
  variant?: ButtonVariant
  children: ReactNode
  className?: string
}

type ButtonAsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined
  }

type ButtonAsLink = SharedProps &
  Omit<LinkProps, 'className' | 'children'> & {
    to: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button(props: ButtonProps) {
  const { variant = 'primary', className = '', children, ...rest } = props
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim()

  if ('to' in rest && rest.to !== undefined) {
    const { to, ...linkRest } = rest
    return (
      <Link to={to} className={classes} {...linkRest}>
        {children}
      </Link>
    )
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button type={buttonRest.type ?? 'button'} className={classes} {...buttonRest}>
      {children}
    </button>
  )
}
