'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : reduce ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

export function useCountUp(target: number, durationMs: number, active: boolean) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs)
      setValue(Math.round(p * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, durationMs])

  return value
}

export function ParticleStreaks({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="addis-streak pointer-events-none absolute h-px w-[40%] max-w-md animate-addis-streak bg-gradient-to-r from-transparent via-white/25 to-transparent"
          style={{
            top: `${8 + (i * 7) % 84}%`,
            left: `${-20 + (i * 13) % 40}%`,
            animationDelay: `${i * 0.35}s`,
            transform: `rotate(${-12 + (i % 5) * 4}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.12] to-white/[0.04] shadow-[0_8px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl',
        'before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent',
        className,
      )}
    >
      {children}
    </div>
  )
}
