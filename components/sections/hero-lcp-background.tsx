import { getImageProps } from 'next/image'

const HERO_LCP_SRC = '/images/qua1.png'

/** Server-only LCP layer — not passed into the client HeroSection. */
export function HeroLcpBackground() {
  const { props: imgProps } = getImageProps({
    alt: '',
    src: HERO_LCP_SRC,
    fill: true,
    priority: true,
    quality: 70,
    sizes: '100vw',
  })

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element -- intentional LCP path via getImageProps */}
      <img
        {...imgProps}
        alt=""
        className="object-cover"
        fetchPriority="high"
        decoding="sync"
      />
    </div>
  )
}
