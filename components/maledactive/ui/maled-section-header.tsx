'use client'

import { MaledReveal } from '@/components/maledactive/motion/maled-reveal'
import { cn } from '@/lib/utils'

export function MaledSectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  id,
}: {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
  id?: string
}) {
  const centered = align === 'center'

  return (
    <MaledReveal className={cn(centered && 'mx-auto text-center', className)}>
      <div className={cn('flex items-center gap-3', centered && 'justify-center')}>
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500/80" aria-hidden />
        <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-amber-400">{eyebrow}</p>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500/80" aria-hidden />
      </div>
      <h2
        id={id}
        className={cn(
          'mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]',
          centered && 'max-w-3xl',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-base leading-relaxed text-slate-400 sm:text-lg',
            centered ? 'mx-auto max-w-2xl' : 'max-w-2xl',
          )}
        >
          {description}
        </p>
      )}
    </MaledReveal>
  )
}
