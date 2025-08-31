import fs from 'fs'
import path from 'path'

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
}

export function getAllBlogPosts(): BlogPost[] {
  const blogsDirectory = path.join(process.cwd(), 'data', 'blogs')
  
  try {
    // Check if directory exists
    if (!fs.existsSync(blogsDirectory)) {
      console.warn('Blogs directory does not exist:', blogsDirectory)
      return []
    }

    const fileNames = fs.readdirSync(blogsDirectory)
    const jsonFiles = fileNames.filter(file => file.endsWith('.json'))
    
    const blogPosts: BlogPost[] = []
    
    for (const fileName of jsonFiles) {
      try {
        const filePath = path.join(blogsDirectory, fileName)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const jsonPost = JSON.parse(fileContent) as JsonBlogPost
        
        // Convert JSON post to BlogPost format
        const blogPost: BlogPost = {
          ...jsonPost,
          featuredImage: jsonPost.featuredImage || null,
          publishedAt: new Date(jsonPost.publishedAt),
          createdAt: jsonPost.createdAt ? new Date(jsonPost.createdAt) : new Date(jsonPost.publishedAt),
          updatedAt: jsonPost.updatedAt ? new Date(jsonPost.updatedAt) : new Date(jsonPost.publishedAt),
          views: jsonPost.views || 0
        }
        
        blogPosts.push(blogPost)
      } catch (error) {
        console.error(`Error reading blog file ${fileName}:`, error)
      }
    }
    
    // Sort by published date (newest first)
    return blogPosts.sort((a, b) => 
      b.publishedAt.getTime() - a.publishedAt.getTime()
    )
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const blogPosts = getAllBlogPosts()
  return blogPosts.find(post => post.slug === slug) || null
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  const blogPosts = getAllBlogPosts()
  return blogPosts.filter(post => post.category === category)
}

export function getRelatedBlogPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  const blogPosts = getAllBlogPosts()
  
  return blogPosts
    .filter(post => 
      post.id !== currentPost.id && 
      post.status === 'published' &&
      (post.category === currentPost.category || 
       post.tags.some(tag => currentPost.tags.includes(tag)))
    )
    .slice(0, limit)
}

export function searchBlogPosts(query: string): BlogPost[] {
  const blogPosts = getAllBlogPosts()
  const lowercaseQuery = query.toLowerCase()
  
  return blogPosts.filter(post => 
    post.status === 'published' &&
    (post.title.toLowerCase().includes(lowercaseQuery) ||
     post.titleAm.toLowerCase().includes(lowercaseQuery) ||
     post.excerpt.toLowerCase().includes(lowercaseQuery) ||
     post.excerptAm.toLowerCase().includes(lowercaseQuery) ||
     post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
     post.tagsAm.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
  )
}

// Function to combine and normalize posts from both database and JSON files
export function combineBlogPosts(dbPosts: any[], jsonPosts: BlogPost[]): BlogPost[] {
  // Normalize database posts to match BlogPost interface
  const normalizedDbPosts: BlogPost[] = dbPosts.map(post => ({
    ...post,
    content: post.content || '',
    contentAm: post.contentAm || '',
    images: post.images || [],
    featuredImage: post.featuredImage,
    publishedAt: new Date(post.publishedAt),
    createdAt: new Date(post.createdAt || post.publishedAt),
    updatedAt: new Date(post.updatedAt || post.publishedAt),
    views: post.views || 0
  }))

  // Combine and sort by published date
  return [...normalizedDbPosts, ...jsonPosts].sort((a, b) => 
    b.publishedAt.getTime() - a.publishedAt.getTime()
  )
}
