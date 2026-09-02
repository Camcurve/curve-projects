import { forwardRef } from 'react'
import { ArrowRight } from '@phosphor-icons/react'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md px-5 py-[14px] text-[14px] font-medium tracking-[0.02em] transition-[background-color,color,border-color,transform,opacity] duration-200 ease-out active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

const variants = {
  primary:
    'bg-brand text-ink shadow-[0_0_0_1px_rgba(255,95,0,0.30),0_10px_24px_-12px_rgba(255,95,0,0.65)] hover:bg-brand-hot',
  ghost:
    'border border-line bg-ink-raised/50 text-bone hover:border-line-bright hover:bg-ink-raised',
  solid: 'bg-bone text-ink hover:bg-bone/90',
  link: 'text-bone-dim hover:text-bone px-0',
}

const sizes = {
  md: 'px-5 py-[14px] text-[14px]',
  lg: 'px-6 py-4 text-[15px]',
  block: 'w-full px-6 py-[16px] text-[15px]',
}

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    withArrow = false,
    className = '',
    children,
    ...rest
  },
  ref
) {
  return (
    <button ref={ref} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      <span>{children}</span>
      {withArrow && <ArrowRight size={16} weight="bold" />}
    </button>
  )
})

export default Button
