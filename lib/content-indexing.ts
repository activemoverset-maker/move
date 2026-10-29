/** SEO indexing helpers for blog/guide JSON (Phase 2). */

export type ContentQuality =
  | 'flagship'
  | 'enriched'
  | 'scaffold'
  | 'needs-enrichment'

export interface IndexableContentFields {
  status: string
  index?: boolean
  quality?: ContentQuality | string
}

export function isIndexable(post: IndexableContentFields): boolean {
  if (post.status !== 'published') return false
  if (post.index === false) return false
  if (post.quality === 'needs-enrichment') return false
  return true
}

export function isFeaturedContent(post: IndexableContentFields): boolean {
  if (post.status !== 'published') return false
  return post.quality === 'flagship' || post.quality === 'enriched'
}
