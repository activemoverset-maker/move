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
  // Ensure title includes company name for SEO
  const seoTitle = title.includes('Active Movers & Packers') ? title : `Active Movers & Packers - ${title}`
  
  const articleSchema = generateArticleSchema({
    title: seoTitle,
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
    { name: 'Home', url: 'https://www.activemoverset.com' },
    { name: 'Blog', url: 'https://www.activemoverset.com/blog' },
    { name: title, url: `https://www.activemoverset.com${url}` },
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
