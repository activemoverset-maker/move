import { Metadata } from 'next'
import { BlogList } from '@/components/pages/blog-list'
import { getAllBlogPosts } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: 'Blog - Active Movers & Packers',
  description: 'Read our latest articles about moving tips, relocation guides, and professional moving services in Addis Ababa.',
  keywords: 'moving blog, relocation tips, Addis Ababa moving, professional movers',
  openGraph: {
    title: 'Blog - Active Movers & Packers',
    description: 'Read our latest articles about moving tips, relocation guides, and professional moving services in Addis Ababa.',
    type: 'website',
    url: 'https://www.activemoverset.com/blog',
    siteName: 'Active Movers & Packers',
    images: [
      {
        url: 'https://www.activemoverset.com/images/gallary/qua1.png',
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
    images: ['https://www.activemoverset.com/images/gallary/qua1.png']
  }
}

export default async function BlogPage() {
  // Get posts solely from JSON files
  const allPosts = getAllBlogPosts()

  return (
    <div className="pt-16">
      <BlogList posts={allPosts} />
    </div>
  )
}
