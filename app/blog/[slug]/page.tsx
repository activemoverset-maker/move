import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/blog-data'
import { BlogPost } from '@/components/pages/blog-post'
import { BlogSEO } from '@/components/seo/blog-seo'
import { generateSEO } from '@/lib/seo-utils'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  
  // Try to get post from database first
  let post = await prisma.blogPost.findFirst({
    where: { slug: slug, status: 'published' },
    include: { videos: true }
  })

  // If not found in database, try JSON files
  if (!post) {
    const jsonPost = getBlogPostBySlug(slug)
    if (jsonPost) {
      post = {
        ...jsonPost,
        videos: [],
        id: jsonPost.id,
        title: jsonPost.title,
        titleAm: jsonPost.titleAm,
        excerpt: jsonPost.excerpt,
        excerptAm: jsonPost.excerptAm,
        content: jsonPost.content,
        contentAm: jsonPost.contentAm,
        author: jsonPost.author,
        category: jsonPost.category,
        tags: jsonPost.tags,
        tagsAm: jsonPost.tagsAm,
        readTime: jsonPost.readTime,
        featuredImage: jsonPost.featuredImage,
        images: jsonPost.images,
        status: jsonPost.status,
        publishedAt: jsonPost.publishedAt,
        slug: jsonPost.slug,
        views: jsonPost.views,
        createdAt: jsonPost.createdAt || jsonPost.publishedAt,
        updatedAt: jsonPost.updatedAt || jsonPost.publishedAt
      }
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
  
  // Try to get post from database first
  let post = await prisma.blogPost.findFirst({
    where: { slug: slug, status: 'published' },
    include: { videos: true }
  })

  let jsonPost = null

  // If not found in database, try JSON files
  if (!post) {
    jsonPost = getBlogPostBySlug(slug)
    if (jsonPost) {
      post = {
        ...jsonPost,
        videos: [],
        id: jsonPost.id,
        title: jsonPost.title,
        titleAm: jsonPost.titleAm,
        excerpt: jsonPost.excerpt,
        excerptAm: jsonPost.excerptAm,
        content: jsonPost.content,
        contentAm: jsonPost.contentAm,
        author: jsonPost.author,
        category: jsonPost.category,
        tags: jsonPost.tags,
        tagsAm: jsonPost.tagsAm,
        readTime: jsonPost.readTime,
        featuredImage: jsonPost.featuredImage,
        images: jsonPost.images,
        status: jsonPost.status,
        publishedAt: jsonPost.publishedAt,
        slug: jsonPost.slug,
        views: jsonPost.views,
        createdAt: jsonPost.createdAt || jsonPost.publishedAt,
        updatedAt: jsonPost.updatedAt || jsonPost.publishedAt
      }
    }
  }

  if (!post) {
    notFound()
  }

  const postUrl = `/blog/${slug}`

  // Get related posts from both sources
  let relatedPosts = []
  
  // Try to get related posts from database
  const dbRelatedPosts = await prisma.blogPost.findMany({
    where: {
      status: 'published',
      id: { not: post.id },
      OR: [{ category: post.category }, { tags: { hasSome: post.tags } }]
    },
    select: {
      id: true, title: true, titleAm: true, slug: true, excerpt: true, excerptAm: true,
      publishedAt: true, category: true, tags: true, tagsAm: true, readTime: true,
      featuredImage: true, views: true, author: true
    },
    orderBy: { publishedAt: 'desc' },
    take: 3
  })

  // Get related posts from JSON files
  const jsonRelatedPosts = getRelatedBlogPosts(post, 3)

  // Combine and deduplicate related posts
  const allRelatedPosts = [...dbRelatedPosts, ...jsonRelatedPosts]
  const uniqueRelatedPosts = allRelatedPosts.filter((relatedPost, index, self) => 
    index === self.findIndex(p => p.id === relatedPost.id)
  ).slice(0, 3)

  // Increment view count if post is from database
  if (post.id && !jsonPost) {
    await prisma.blogPost.update({ 
      where: { id: post.id }, 
      data: { views: { increment: 1 } } 
    })
  }

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
 
 
 