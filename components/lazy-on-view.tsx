'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface LazyOnViewProps {
  children: ReactNode
  minHeight?: string
  rootMargin?: string
  className?: string
}

export function LazyOnView({
  children,
  minHeight = '16rem',
  rootMargin = '280px',
  className,
}: LazyOnViewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || show) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, show])

  return (
    <div ref={ref} className={className} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  )
}
