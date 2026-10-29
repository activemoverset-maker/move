import Image from 'next/image'

/** Static LCP hero background — server-rendered so Next emits preload + fetchpriority. */
export function HeroLcpBackground() {
  return (
    <Image
      src="/images/qua1.png"
      alt=""
      fill
      priority
      fetchPriority="high"
      quality={70}
      sizes="100vw"
      className="object-cover"
    />
  )
}
