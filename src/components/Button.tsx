import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { ArrowRight } from './Icons'

type Variant = 'circle' | 'outline' | 'outline-dark' | 'light' | 'gold' | 'dark'

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  arrow?: boolean
  labelClassName?: string
  children: ReactNode
}

const styles: Record<Exclude<Variant, 'circle'>, string> = {
  outline: 'border border-cream/30 text-cream hover:border-gold hover:text-gold',
  'outline-dark': 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream',
  light: 'bg-cream text-ink hover:bg-gold',
  gold: 'bg-gradient-to-br from-gold-soft to-gold text-ink hover:brightness-110',
  dark: 'bg-ink text-cream hover:bg-forest',
}

export default function Button({
  variant = 'outline',
  arrow = true,
  labelClassName = 'text-cream',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  if (variant === 'circle') {
    return (
      <a
        href="#"
        data-magnetic
        className={`group inline-flex items-center gap-4 ${className}`}
        {...rest}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold text-ink shadow-[0_0_40px_-6px] shadow-gold/60 transition-transform duration-500 group-hover:scale-110">
          <ArrowRight
            size={18}
            className="transition-transform duration-500 group-hover:translate-x-0.5"
          />
        </span>
        <span className={`text-sm font-medium tracking-wide ${labelClassName}`}>{children}</span>
      </a>
    )
  }

  return (
    <a
      href="#"
      data-magnetic
      className={`group inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-500 ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
      {arrow ? (
        <ArrowRight
          size={16}
          className="transition-transform duration-500 group-hover:translate-x-1"
        />
      ) : null}
    </a>
  )
}
