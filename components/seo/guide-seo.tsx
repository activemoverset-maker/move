"use client"

import Script from 'next/script'
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo-utils'

interface GuideSEOProps {
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

export function GuideSEO({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  url,
  section,
  tags,
  readTime,
  image,
}: GuideSEOProps) {
  const seoTitle = title.includes('Active Movers') ? title : `Active Movers & Packers - ${title}`

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
    image,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.activemoverset.com' },
    { name: 'Moving Guides', url: 'https://www.activemoverset.com/guides' },
    { name: title, url: `https://www.activemoverset.com${url}` },
  ])

  return (
    <>
      <Script
        id="guide-article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <Script
        id="guide-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  )
}
