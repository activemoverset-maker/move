import { Metadata } from 'next'
import { BlogList } from '@/components/pages/blog-list'
import { prisma } from '@/lib/prisma'
import { getAllBlogPosts, combineBlogPosts } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: 'Blog - Active Movers & Packers',
  description: 'Read our latest articles about moving tips, relocation guides, and professional moving services in Addis Ababa.',
  keywords: 'moving blog, relocation tips, Addis Ababa moving, professional movers',
  openGraph: {
    title: 'Blog - Active Movers & Packers',
    description: 'Read our latest articles about moving tips, relocation guides, and professional moving services in Addis Ababa.',
    type: 'website',
    url: 'https://activemoverset.com/blog',
    siteName: 'Active Movers & Packers',
    images: [
      {
        url: 'https://activemoverset.com/images/gallary/qua1.png',
        width: 1200,
        height: 630,
        alt: 'Active Movers Blog'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Active Movers & Packers',
    description: 'Read our latest articles about moving tips, relocation guides, and professional moving services in Addis Ababa.',
    images: ['https://activemoverset.com/images/gallary/qua1.png']
  }
}

export default async function BlogPage() {
  // Get posts from database
  const dbPosts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    select: {
      id: true, title: true, titleAm: true, slug: true, excerpt: true, excerptAm: true,
      publishedAt: true, category: true, tags: true, tagsAm: true, readTime: true,
      featuredImage: true, views: true, author: true, content: true, contentAm: true,
      images: true, createdAt: true, updatedAt: true
    },
    orderBy: { publishedAt: 'desc' }
  })

  // Get posts from JSON files
  const jsonPosts = getAllBlogPosts()

  // Combine both sources using the helper function
  const allPosts = combineBlogPosts(dbPosts, jsonPosts)

  return (
    <div className="pt-16">
      <BlogList posts={allPosts} />
    </div>
  )
} 
 
 
 