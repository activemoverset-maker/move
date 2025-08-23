import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogPost } from '@/components/pages/blog-post'
import { BLOG_POSTS } from '@/constants/site'
import { generateSlug } from '@/lib/utils'
import { generateSEO } from '@/lib/seo-utils'
import { BlogSEO } from '@/components/seo/blog-seo'

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
      title: 'Active Movers & Packers - Blog Post Not Found',
      description: 'The requested blog post could not be found on Active Movers & Packers website.',
    }
  }

  const postUrl = `/blog/${slug}`
  const seoTitle = `Active Movers & Packers - ${post.title} | Moving Tips & Expert Advice`

  return generateSEO({
    title: seoTitle,
    description: post.excerpt,
    keywords: post.tags,
    author: post.author,
    url: postUrl,
    type: 'article',
    publishedTime: post.publishedAt.toISOString(),
    modifiedTime: post.publishedAt.toISOString(),
    section: post.category,
    tags: post.tags,
    readTime: post.readTime,
    canonical: postUrl,
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = BLOG_POSTS.find(p => generateSlug(p.title) === slug)
  
  if (!post) {
    notFound()
  }

  const postUrl = `/blog/${slug}`

  return (
    <>
      <BlogSEO
        title={post.title}
        description={post.excerpt}
        author={post.author}
        publishedTime={post.publishedAt.toISOString()}
        modifiedTime={post.publishedAt.toISOString()}
        url={postUrl}
        section={post.category}
        tags={post.tags}
        readTime={post.readTime}
      />
      <div className="pt-16">
        <BlogPost post={post} />
      </div>
    </>
  )
} 
 
 
 