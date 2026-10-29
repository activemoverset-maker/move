import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGuideBySlug, getPublishedGuides, getRelatedGuides } from '@/lib/guide-data'
import { GuidePost } from '@/components/pages/guide-post'
import { GuideSEO } from '@/components/seo/guide-seo'
import { generateSEO } from '@/lib/seo-utils'
import { isIndexable } from '@/lib/content-indexing'

interface GuidePostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getPublishedGuides().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: GuidePostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getGuideBySlug(slug)

  if (!post || post.status !== 'published') {
    return {
      title: 'Guide Not Found - Active Movers & Packers',
      description: 'The requested moving guide could not be found.',
    }
  }

  return generateSEO({
    title: post.title,
    description: post.excerpt,
    url: `/guides/${slug}`,
    type: 'article',
    publishedTime: post.publishedAt.toISOString(),
    modifiedTime: post.updatedAt?.toISOString() || post.publishedAt.toISOString(),
    author: post.author,
    section: post.category,
    tags: post.tags,
    image: post.featuredImage || undefined,
    index: isIndexable(post),
  })
}

export default async function GuidePostPage({ params }: GuidePostPageProps) {
  const { slug } = await params
  const jsonPost = getGuideBySlug(slug)

  if (!jsonPost || jsonPost.status !== 'published') {
    notFound()
  }

  const post = {
    ...jsonPost,
    createdAt: jsonPost.createdAt || jsonPost.publishedAt,
    updatedAt: jsonPost.updatedAt || jsonPost.publishedAt,
  }

  const relatedPosts = getRelatedGuides(post, 3).map((p) => ({
    ...p,
    slug: p.slug,
  }))

  const postUrl = `/guides/${slug}`

  return (
    <>
      <GuideSEO
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
        <GuidePost post={post} relatedPosts={relatedPosts} />
      </div>
    </>
  )
}
