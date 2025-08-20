import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogPost } from '@/components/pages/blog-post'
import { BLOG_POSTS } from '@/constants/site'
import { generateSlug } from '@/lib/utils'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find(p => generateSlug(p.title) === slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: `${post.title} | Active Movers & Packers Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = BLOG_POSTS.find(p => generateSlug(p.title) === slug)
  
  if (!post) {
    notFound()
  }

  return (
    <div className="pt-16">
      <BlogPost post={post} />
    </div>
  )
} 
 
 
 