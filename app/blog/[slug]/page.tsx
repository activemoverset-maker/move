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
  let post = null

  let jsonPost = null

 
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

  if (!post) {
    notFound()
  }

  const postUrl = `/blog/${slug}`

  // Get related posts from both sources
  let relatedPosts = []
  
  // Try to get related posts from database
  const dbRelatedPosts = null

  // Get related posts from JSON files
  const jsonRelatedPosts = getRelatedBlogPosts(post, 6)

  // Combine and deduplicate related posts
  const allRelatedPosts = jsonRelatedPosts
  const uniqueRelatedPosts = allRelatedPosts.filter((relatedPost, index, self) => 
    index === self.findIndex(p => p.id === relatedPost.id)
  ).slice(0, 3)

  // Increment view count if post is from database
 

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
 
 
 
