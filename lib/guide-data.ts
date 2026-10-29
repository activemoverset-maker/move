import fs from 'fs'
import path from 'path'
import { cache } from 'react'
import { isFeaturedContent, isIndexable } from '@/lib/content-indexing'

export interface GuidePost {
  id: string
  title: string
  titleAm: string
  excerpt: string
  excerptAm: string
  content: string
  contentAm: string
  author: string
  category: string
  tags: string[]
  tagsAm: string[]
  readTime: number
  featuredImage: string | null
  images: string[]
  status: string
  publishedAt: Date
  slug: string
  views: number
  createdAt?: Date
  updatedAt?: Date
  index?: boolean
  quality?: string
  enrichedAt?: string
}

export interface JsonGuidePost {
  id: string
  title: string
  titleAm: string
  excerpt: string
  excerptAm: string
  content: string
  contentAm: string
  author: string
  category: string
  tags: string[]
  tagsAm: string[]
  readTime: number
  featuredImage: string
  images: string[]
  status: string
  publishedAt: string
  slug: string
  views?: number
  createdAt?: string
  updatedAt?: string
  index?: boolean
  quality?: string
  enrichedAt?: string
}

const guidesDirectory = () => path.join(process.cwd(), 'data', 'guides')

function parseGuideJson(jsonPost: JsonGuidePost, includeContent = true): GuidePost {
  return {
    ...jsonPost,
    content: includeContent ? jsonPost.content : '',
    contentAm: includeContent ? jsonPost.contentAm : '',
    images: includeContent ? jsonPost.images : [],
    featuredImage: jsonPost.featuredImage || null,
    publishedAt: new Date(jsonPost.publishedAt),
    createdAt: jsonPost.createdAt ? new Date(jsonPost.createdAt) : new Date(jsonPost.publishedAt),
    updatedAt: jsonPost.updatedAt ? new Date(jsonPost.updatedAt) : new Date(jsonPost.publishedAt),
    views: jsonPost.views || 0,
  }
}

function readGuideFile(filePath: string, includeContent = true): GuidePost | null {
  try {
    const jsonPost = JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonGuidePost
    return parseGuideJson(jsonPost, includeContent)
  } catch (error) {
    console.error(`Error reading guide file ${filePath}:`, error)
    return null
  }
}

function readGuides(includeContent: boolean): GuidePost[] {
  const dir = guidesDirectory()

  try {
    if (!fs.existsSync(dir)) {
      return []
    }

    const jsonFiles = fs.readdirSync(dir).filter((file) => file.endsWith('.json'))
    const guides: GuidePost[] = []

    for (const fileName of jsonFiles) {
      const post = readGuideFile(path.join(dir, fileName), includeContent)
      if (post) guides.push(post)
    }

    return guides.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  } catch (error) {
    console.error('Error reading guides:', error)
    return []
  }
}

export const getAllGuides = cache((): GuidePost[] => readGuides(true))

export const getPublishedGuides = cache((): GuidePost[] =>
  readGuides(false).filter((post) => post.status === 'published')
)

export const getIndexableGuides = cache((): GuidePost[] =>
  getPublishedGuides().filter((post) => isIndexable(post))
)

export const getFeaturedGuides = cache((): GuidePost[] => {
  const published = getPublishedGuides()
  const indexable = published.filter((post) => isIndexable(post))
  const pool = indexable.length >= 4 ? indexable : published.filter((post) => isFeaturedContent(post))
  return pool.sort((a, b) => {
    const aFlag = a.quality === 'flagship' ? 1 : 0
    const bFlag = b.quality === 'flagship' ? 1 : 0
    if (bFlag !== aFlag) return bFlag - aFlag
    return b.publishedAt.getTime() - a.publishedAt.getTime()
  })
})

export const getGuideBySlug = cache((slug: string): GuidePost | null => {
  const directPath = path.join(guidesDirectory(), `${slug}.json`)
  if (fs.existsSync(directPath)) {
    return readGuideFile(directPath, true)
  }

  return getAllGuides().find((post) => post.slug === slug) || null
})

export function getGuidesByCategory(category: string): GuidePost[] {
  return getPublishedGuides().filter((post) => post.category === category)
}

export function getRelatedGuides(currentPost: GuidePost, limit: number = 3): GuidePost[] {
  return getPublishedGuides()
    .filter(
      (post) =>
        post.id !== currentPost.id &&
        (post.category === currentPost.category ||
          post.tags.some((tag) => currentPost.tags.includes(tag)))
    )
    .slice(0, limit)
}

export function searchGuides(query: string): GuidePost[] {
  const lowercaseQuery = query.toLowerCase()

  return getPublishedGuides().filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.titleAm.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.excerptAm.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
      post.tagsAm.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  )
}
