'use client'

import { LazyOnView } from '@/components/lazy-on-view'

interface LazyMapProps {
  src: string
  title: string
}

export function LazyMap({ src, title }: LazyMapProps) {
  return (
    <LazyOnView minHeight="24rem" rootMargin="200px" className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg sm:h-80 lg:h-96">
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        className="absolute inset-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/10" />
    </LazyOnView>
  )
}
