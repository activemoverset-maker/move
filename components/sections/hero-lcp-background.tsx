import { getImageProps } from 'next/image'
import { preload } from 'react-dom'

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

  // getImageProps sets fetchpriority on the img but does not emit <link rel="preload">.
  // Next's Image component is what calls ReactDOM.preload. Match that so the
  // request starts in the head, in parallel with render-blocking CSS.
  if (imgProps.src) {
    preload(imgProps.src, {
      as: 'image',
      imageSrcSet: imgProps.srcSet,
      imageSizes: imgProps.sizes,
      fetchPriority: 'high',
    })
  }

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
