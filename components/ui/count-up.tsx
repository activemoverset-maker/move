'use client'

import { useEffect, useState } from 'react'

interface CountUpProps {
  end: number
  duration?: number
  inView: boolean
  suffix?: string
  prefix?: string
  className?: string
}

export function CountUp({
  end,
  duration = 2000,
  inView,
  suffix = '',
  prefix = '',
  className,
}: CountUpProps) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return

    let frame: number
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(end * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [end, duration, inView])

  return (
    <span className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  )
}
