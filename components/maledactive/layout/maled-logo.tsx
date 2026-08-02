import Image from 'next/image'
import Link from 'next/link'
import { MALED_ASSETS } from '@/lib/maledactive-config'
import { cn } from '@/lib/utils'

function maledPath(href: string) {
  if (href === '/') return '/sites/maledactive'
  return `/sites/maledactive${href}`
}

export function MaledLogo({
  className,
  imageClassName,
  priority = false,
}: {
  className?: string
  imageClassName?: string
  priority?: boolean
}) {
  return (
    <Link href={maledPath('/')} className={cn('group inline-flex items-center', className)}>
      <Image
        src={MALED_ASSETS.logo}
        alt="Maled Active Movers"
        width={180}
        height={48}
        priority={priority}
        className={cn('h-10 w-auto object-contain transition group-hover:opacity-90 sm:h-11', imageClassName)}
      />
    </Link>
  )
}
