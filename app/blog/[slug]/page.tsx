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
  
  let post = null

  // Get post solely from JSON files
  const jsonPost = getBlogPostBySlug(slug)
  if (jsonPost) {
    post = {
      ...jsonPost,
      // Fallback for dates if they don't exist in the JSON
      createdAt: jsonPost.createdAt || jsonPost.publishedAt,
      updatedAt: jsonPost.updatedAt || jsonPost.publishedAt
    }
  }

  if (!post) {
    return {
      title: 'Post Not Found - Active Movers & Packers',
      description: 'The requested blog post could not be found.'
    }
  }

  const postUrl = `/blog/${slug}`
  
  return generateSEO({
    title: post.title,
    description: post.excerpt,
    url: postUrl,
    type: 'article',
    publishedTime: post.publishedAt.toISOString(),
    modifiedTime: post.updatedAt?.toISOString() || post.publishedAt.toISOString(),
    author: post.author,
    section: post.category,
    tags: post.tags,
    image: post.featuredImage || undefined
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  
  let post = null

  // Get post solely from JSON files
  const jsonPost = getBlogPostBySlug(slug)
  if (jsonPost) {
    post = {
      ...jsonPost,
      // Fallback for dates if they don't exist in the JSON
      createdAt: jsonPost.createdAt || jsonPost.publishedAt,
      updatedAt: jsonPost.updatedAt || jsonPost.publishedAt
    }
  }

  if (!post) {
    notFound()
  }

  const postUrl = `/blog/${slug}`

  // Get related posts solely from JSON files
  const uniqueRelatedPosts = getRelatedBlogPosts(post, 3)

  return (
    <>
      <BlogSEO 
        title={post.title}
        description={post.excerpt}
        author={post.author}
        publishedTime={post.publishedAt.toISOString()}
        modifiedTime={post.updatedAt?.toISOString() || post.publishedAt.toISOString()}
        url={postUrl}
        section={post.category}
        tags={post.tags}
        readTime={post.readTime}
        image={post.featuredImage || undefined}
      />
      <div className="pt-16">
        <BlogPost post={post} relatedPosts={uniqueRelatedPosts} />
      </div>
    </>
  )
}
