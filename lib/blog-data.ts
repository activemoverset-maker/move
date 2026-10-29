import fs from 'fs'
import path from 'path'
import { cache } from 'react'
import { isFeaturedContent, isIndexable } from '@/lib/content-indexing'

export interface BlogPost {
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

export interface JsonBlogPost {
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

const blogsDirectory = () => path.join(process.cwd(), 'data', 'blogs')

function parseBlogJson(jsonPost: JsonBlogPost, includeContent = true): BlogPost {
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

function readBlogFile(filePath: string, includeContent = true): BlogPost | null {
  try {
    const jsonPost = JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonBlogPost
    return parseBlogJson(jsonPost, includeContent)
  } catch (error) {
    console.error(`Error reading blog file ${filePath}:`, error)
    return null
  }
}

function readBlogPosts(includeContent: boolean): BlogPost[] {
  const dir = blogsDirectory()

  try {
    if (!fs.existsSync(dir)) {
      return []
    }

    const jsonFiles = fs.readdirSync(dir).filter((file) => file.endsWith('.json'))
    const blogPosts: BlogPost[] = []

    for (const fileName of jsonFiles) {
      const post = readBlogFile(path.join(dir, fileName), includeContent)
      if (post) blogPosts.push(post)
    }

    return blogPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

export const getAllBlogPosts = cache((): BlogPost[] => readBlogPosts(false))

export const getIndexableBlogPosts = cache((): BlogPost[] =>
  getAllBlogPosts().filter((post) => isIndexable(post))
)

export const getFeaturedBlogPosts = cache((): BlogPost[] => {
  const all = getAllBlogPosts()
  const indexable = all.filter((post) => isIndexable(post))
  const pool = indexable.length >= 4 ? indexable : all.filter((post) => isFeaturedContent(post))
  return pool.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
})

export const getBlogPostBySlug = cache((slug: string): BlogPost | null => {
  const directPath = path.join(blogsDirectory(), `${slug}.json`)
  if (fs.existsSync(directPath)) {
    return readBlogFile(directPath, true)
  }

  return readBlogPosts(true).find((post) => post.slug === slug) || null
})

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return getAllBlogPosts().filter((post) => post.category === category)
}

export function getRelatedBlogPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  return getAllBlogPosts()
    .filter(
      (post) =>
        post.id !== currentPost.id &&
        post.status === 'published' &&
        (post.category === currentPost.category ||
          post.tags.some((tag) => currentPost.tags.includes(tag)))
    )
    .slice(0, limit)
}

export function searchBlogPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase()

  return getAllBlogPosts().filter(
    (post) =>
      post.status === 'published' &&
      (post.title.toLowerCase().includes(lowercaseQuery) ||
        post.titleAm.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt.toLowerCase().includes(lowercaseQuery) ||
        post.excerptAm.toLowerCase().includes(lowercaseQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
        post.tagsAm.some((tag) => tag.toLowerCase().includes(lowercaseQuery)))
  )
}

export function combineBlogPosts(dbPosts: any[], jsonPosts: BlogPost[]): BlogPost[] {
  const normalizedDbPosts: BlogPost[] = dbPosts.map((post) => ({
    ...post,
    content: post.content || '',
    contentAm: post.contentAm || '',
    images: post.images || [],
    featuredImage: post.featuredImage,
    publishedAt: new Date(post.publishedAt),
    createdAt: new Date(post.createdAt || post.publishedAt),
    updatedAt: new Date(post.updatedAt || post.publishedAt),
    views: post.views || 0,
  }))

  return [...normalizedDbPosts, ...jsonPosts].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  )
}
