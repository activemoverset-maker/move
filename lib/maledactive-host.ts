const DEFAULT_MALED_HOSTS = ['maledactive.homes', 'www.maledactive.homes']

export function getMaledActiveHosts(): string[] {
  const fromEnv = process.env.MALED_HOSTS?.split(',').map((h) => h.trim().toLowerCase()).filter(Boolean)
  return fromEnv?.length ? fromEnv : DEFAULT_MALED_HOSTS
}

export function normalizeHost(host: string | null): string {
  if (!host) return ''
  return host.split(':')[0].toLowerCase()
}

export function isMaledActiveHost(host: string | null): boolean {
  const normalized = normalizeHost(host)
  if (!normalized) return false
  return getMaledActiveHosts().some(
    (h) => normalized === h || normalized.endsWith(`.${h.replace(/^www\./, '')}`),
  )
}

/** Allow direct /sites/maledactive preview on localhost during development */
export function isLocalDevHost(host: string | null): boolean {
  const normalized = normalizeHost(host)
  return normalized === 'localhost' || normalized === '127.0.0.1'
}

export const MALED_INTERNAL_PREFIX = '/sites/maledactive'

export const MALED_BLOCKED_ON_MALED = [
  '/admin',
  '/blog',
  '/booking',
  '/tiktok',
  '/videos',
  '/api/admin',
  '/addis-active-movers',
  '/bole-bulbula',
] as const

export function toMaledInternalPath(pathname: string): string {
  if (pathname === '/') return MALED_INTERNAL_PREFIX
  return `${MALED_INTERNAL_PREFIX}${pathname}`
}
