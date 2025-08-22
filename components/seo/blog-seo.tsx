"use client"

import Script from 'next/script'
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo-utils'

interface BlogSEOProps {
  title: string
  description: string
  author: string
  publishedTime: string
  modifiedTime: string
  url: string
  section: string
  tags: string[]
  readTime: number
  image?: string
}

export function BlogSEO({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  url,
  section,
  tags,
  readTime,
  image
}: BlogSEOProps) {
  const articleSchema = generateArticleSchema({
    title,
    description,
    author,
    publishedTime,
    modifiedTime,
    url,
    section,
    tags,
    readTime,
    image
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://activemovers.com' },
    { name: 'Blog', url: 'https://activemovers.com/blog' },
    { name: title, url: `https://activemovers.com${url}` },
  ])

  return (
    <>
      {/* Article Schema */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      
      {/* Breadcrumb Schema */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  )
}
