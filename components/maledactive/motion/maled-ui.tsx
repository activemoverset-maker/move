'use client'

import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function MaledGlassPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function MaledParticleStreaks({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return null

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute h-px w-[40%] max-w-md animate-maled-streak bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"
          style={{
            top: `${8 + (i * 8) % 84}%`,
            left: `${-20 + (i * 13) % 40}%`,
            animationDelay: `${i * 0.4}s`,
            transform: `rotate(${-12 + (i % 5) * 4}deg)`,
          }}
        />
      ))}
    </div>
  )
}
