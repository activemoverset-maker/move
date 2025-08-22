import { BLOG_POSTS } from '@/constants/site'
import { generateSlug } from '@/lib/utils'

export interface SitemapUrl {
  loc: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export interface SitemapData {
  urls: SitemapUrl[]
  lastUpdated: string
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://activemovers.com'

export function generateSitemap(): SitemapData {
  const now = new Date().toISOString()
  const urls: SitemapUrl[] = [
    // Static pages
    {
      loc: `${SITE_URL}`,
      lastmod: now,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${SITE_URL}/about`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${SITE_URL}/services`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${SITE_URL}/contact`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${SITE_URL}/blog`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${SITE_URL}/booking`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8
    },
    // Service pages
    {
      loc: `${SITE_URL}/services/local-moving`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${SITE_URL}/services/office-relocation`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${SITE_URL}/services/packaging`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${SITE_URL}/services/storage`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8
    }
  ]

  // Add blog posts
  BLOG_POSTS.forEach(post => {
    urls.push({
      loc: `${SITE_URL}/blog/${generateSlug(post.title)}`,
      lastmod: post.publishedAt.toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    })
  })

  return {
    urls,
    lastUpdated: now
  }
}

export function generateSitemapXML(sitemapData: SitemapData): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  const urlsetClose = '</urlset>'

  const urlEntries = sitemapData.urls.map(url => {
    return `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  }).join('\n')

  return `${xmlHeader}
${urlsetOpen}
${urlEntries}
${urlsetClose}`
}

export function generateRobotsTxt(): string {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`
  
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${sitemapUrl}

# Crawl-delay
Crawl-delay: 1

# Disallow admin areas
Disallow: /admin/
Disallow: /api/admin/

# Allow important pages
Allow: /blog/
Allow: /services/
Allow: /about/
Allow: /contact/
Allow: /booking/`
}
