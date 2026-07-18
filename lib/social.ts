export const SOCIAL = {
  tiktok: {
    username: 'activemoverset',
    handle: '@activemoverset',
    displayName: 'Active Movers ET',
    profileUrl: 'https://www.tiktok.com/@activemoverset',
  },
  telegram: 'activemovers',
} as const

export function buildTikTokVideoUrl(videoId: string): string {
  return `https://www.tiktok.com/@${SOCIAL.tiktok.username}/video/${videoId}`
}

export function isActiveMoversTikTokAuthor(authorUrl: string | null | undefined): boolean {
  if (!authorUrl) return false
  const normalized = authorUrl.toLowerCase()
  return (
    normalized.includes('@activemoverset') ||
    normalized.includes('/activemoverset')
  )
}
