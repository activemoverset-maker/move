import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/blog-data'
import { BlogPost } from '@/components/pages/blog-post'
import { BlogSEO } from '@/components/seo/blog-seo'
import { generateSEO } from '@/lib/seo-utils'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found - Active Movers & Packers',
      description: 'The requested blog post could not be found.'
    }
  }

  return generateSEO({
    title: post.title,
    description: post.excerpt,
    url: `/blog/${slug}`,
    type: 'article',
    publishedTime: new Date(post.publishedAt).toISOString(),
    modifiedTime: new Date(post.updatedAt || post.publishedAt).toISOString(),
    author: post.author,
    section: post.category,
    tags: post.tags,
    image: post.featuredImage || undefined
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const postUrl = `/blog/${slug}`

  const relatedPosts = getRelatedBlogPosts(post, 3)

  return (
    <>
      <BlogSEO 
        title={post.title}
        description={post.excerpt}
        author={post.author}
        publishedTime={new Date(post.publishedAt).toISOString()}
        modifiedTime={new Date(post.updatedAt || post.publishedAt).toISOString()}
        url={postUrl}
        section={post.category}
        tags={post.tags}
        readTime={post.readTime}
        image={post.featuredImage || undefined}
      />
      <div className="pt-16">
        <BlogPost post={post} relatedPosts={relatedPosts} />
      </div>
    </>
  )
}
