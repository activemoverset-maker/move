import { generateSlug } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { getAllBlogPosts } from '@/lib/blog-data'

export interface SitemapUrl {
  loc: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export interface NewsSitemapUrl {
  loc: string
  lastmod: string
  title: string
  publication_name: string
  publication_language: string
}

export interface SitemapData {
  urls: SitemapUrl[]
  lastUpdated: string
}

const SITE_URL = 'https://activemoverset.com'

// Helper function to escape XML entities
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function generateSitemap(): Promise<SitemapUrl[]> {
  const baseUrl = 'https://activemoverset.com'
  
  // Get blog posts from database
  const dbBlogPosts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    select: { slug: true, updatedAt: true, publishedAt: true }
  })

  // Get blog posts from JSON files
  const jsonBlogPosts = getAllBlogPosts()

  const sitemap: SitemapUrl[] = [
    {
      loc: `${baseUrl}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/services`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/gallery`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.6
    }
  ]

  // Add database blog posts
  dbBlogPosts.forEach(post => {
    sitemap.push({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.updatedAt.toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    })
  })

  // Add JSON blog posts
  jsonBlogPosts.forEach(post => {
    sitemap.push({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.updatedAt?.toISOString() || post.publishedAt.toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    })
  })

  return sitemap
}

export async function generateNewsSitemap(): Promise<NewsSitemapUrl[]> {
  const baseUrl = 'https://activemoverset.com'
  
  // Get blog posts from database
  const dbBlogPosts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    select: { slug: true, title: true, updatedAt: true, publishedAt: true }
  })

  // Get blog posts from JSON files
  const jsonBlogPosts = getAllBlogPosts()

  const newsSitemap: NewsSitemapUrl[] = []

  // Add database blog posts
  dbBlogPosts.forEach(post => {
    newsSitemap.push({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.updatedAt.toISOString(),
      title: post.title,
      publication_name: 'Active Movers & Packers Blog',
      publication_language: 'en'
    })
  })

  // Add JSON blog posts
  jsonBlogPosts.forEach(post => {
    newsSitemap.push({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.updatedAt?.toISOString() || post.publishedAt.toISOString(),
      title: post.title,
      publication_name: 'Active Movers & Packers Blog',
      publication_language: 'en'
    })
  })

  return newsSitemap
}

export function generateSitemapXML(sitemap: SitemapUrl[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`
  return xml
}

export function generateNewsSitemapXML(newsSitemap: NewsSitemapUrl[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsSitemap.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <news:news>
      <news:publication>
        <news:name>${url.publication_name}</news:name>
        <news:language>${url.publication_language}</news:language>
      </news:publication>
      <news:publication_date>${url.lastmod}</news:publication_date>
      <news:title>${url.title}</news:title>
    </news:news>
  </url>`).join('\n')}
</urlset>`
  return xml
}

export function generateImageSitemap(): string {
  const now = new Date().toISOString()
  
  // Main website images
  const mainImages = [
    {
      loc: `${SITE_URL}/images/logo.jpg`,
      title: 'Active Movers &amp; Packers Logo',
      caption: 'Professional moving services logo for Addis Ababa',
      page: `${SITE_URL}`
    },
    {
      loc: `${SITE_URL}/images/logotr.png`,
      title: 'Active Movers &amp; Packers Transparent Logo',
      caption: 'Transparent logo for moving and packing services',
      page: `${SITE_URL}`
    },
    {
      loc: `${SITE_URL}/images/logom.jpg`,
      title: 'Active Movers &amp; Packers Mobile Logo',
      caption: 'Mobile optimized logo for moving services',
      page: `${SITE_URL}`
    }
  ]

  // Gallery images for moving services
  const galleryImages = [
    {
      loc: `${SITE_URL}/images/gallary/qua1.png`,
      title: 'Professional Moving Services in Addis Ababa',
      caption: 'Expert moving team handling furniture safely',
      page: `${SITE_URL}/services`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua2.png`,
      title: 'Office Relocation Services Ethiopia',
      caption: 'Professional office moving and setup services',
      page: `${SITE_URL}/services/office-relocation`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua3.png`,
      title: 'Residential Moving Addis Ababa',
      caption: 'Safe and reliable home moving services',
      page: `${SITE_URL}/services/local-moving`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua4.png`,
      title: 'Packing Services Ethiopia',
      caption: 'Professional packing and unpacking services',
      page: `${SITE_URL}/services/packaging`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua5.png`,
      title: 'Storage Solutions Addis Ababa',
      caption: 'Secure storage facilities for your belongings',
      page: `${SITE_URL}/services/storage`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua6.jpeg`,
      title: 'Moving Truck and Equipment',
      caption: 'Modern moving trucks and professional equipment',
      page: `${SITE_URL}/services`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua7.jpeg`,
      title: 'Furniture Moving Services',
      caption: 'Careful handling of furniture and appliances',
      page: `${SITE_URL}/services/local-moving`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua8.jpeg`,
      title: 'Professional Moving Team',
      caption: 'Experienced Ethiopian moving professionals',
      page: `${SITE_URL}/about`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua9.jpeg`,
      title: 'International Moving Services',
      caption: 'Cross-border and international moving solutions',
      page: `${SITE_URL}/services`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua10.jpeg`,
      title: 'Commercial Moving Addis Ababa',
      caption: 'Business and commercial relocation services',
      page: `${SITE_URL}/services/office-relocation`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua11.jpeg`,
      title: 'Packing Materials and Supplies',
      caption: 'High-quality packing materials and supplies',
      page: `${SITE_URL}/services/packaging`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua12.jpeg`,
      title: 'Storage Facility Addis Ababa',
      caption: 'Climate-controlled storage facilities',
      page: `${SITE_URL}/services/storage`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua13.jpeg`,
      title: 'Moving Services Ethiopia',
      caption: 'Comprehensive moving services across Ethiopia',
      page: `${SITE_URL}/services`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua14.jpeg`,
      title: 'Professional Packing Team',
      caption: 'Expert packing and unpacking services',
      page: `${SITE_URL}/services/packaging`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua15.jpeg`,
      title: 'Moving Equipment and Tools',
      caption: 'Professional moving equipment and safety tools',
      page: `${SITE_URL}/services`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua16.jpeg`,
      title: 'Residential Moving Team',
      caption: 'Dedicated team for residential moving services',
      page: `${SITE_URL}/services/local-moving`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua17.jpeg`,
      title: 'Office Setup Services',
      caption: 'Complete office setup and installation services',
      page: `${SITE_URL}/services/office-relocation`
    },
    {
      loc: `${SITE_URL}/images/gallary/qua18.jpeg`,
      title: 'Moving and Packing Services',
      caption: 'Complete moving and packing solutions',
      page: `${SITE_URL}/services`
    }
  ]

  // Testimonial images
  const testimonialImages = [
    {
      loc: `${SITE_URL}/images/testimonials/fcg1.jpg`,
      title: 'Customer Testimonial - Moving Services',
      caption: 'Satisfied customer testimonial for moving services',
      page: `${SITE_URL}/about`
    },
    {
      loc: `${SITE_URL}/images/testimonials/fcg2.jpg`,
      title: 'Client Review - Office Relocation',
      caption: 'Positive client review for office relocation services',
      page: `${SITE_URL}/about`
    },
    {
      loc: `${SITE_URL}/images/testimonials/fcg3.jpg`,
      title: 'Customer Feedback - Packing Services',
      caption: 'Excellent customer feedback for packing services',
      page: `${SITE_URL}/about`
    },
    {
      loc: `${SITE_URL}/images/testimonials/fcg4.jpg`,
      title: 'Client Testimonial - Storage Solutions',
      caption: 'Happy client testimonial for storage services',
      page: `${SITE_URL}/about`
    },
    {
      loc: `${SITE_URL}/images/testimonials/fcg5.jpg`,
      title: 'Customer Review - Professional Moving',
      caption: 'Professional moving services customer review',
      page: `${SITE_URL}/about`
    },
    {
      loc: `${SITE_URL}/images/testimonials/fcg7.jpg`,
      title: 'Client Feedback - Addis Ababa Moving',
      caption: 'Local Addis Ababa moving services feedback',
      page: `${SITE_URL}/about`
    },
    {
      loc: `${SITE_URL}/images/testimonials/fcg8.jpg`,
      title: 'Customer Testimonial - Ethiopian Moving',
      caption: 'Ethiopian moving services customer testimonial',
      page: `${SITE_URL}/about`
    },
    {
      loc: `${SITE_URL}/images/testimonials/fcg9.jpg`,
      title: 'Client Review - Reliable Moving',
      caption: 'Reliable moving services client review',
      page: `${SITE_URL}/about`
    }
  ]

  // Additional service images
  const serviceImages = [
    {
      loc: `${SITE_URL}/images/6048392380857567568.jpg`,
      title: 'Moving Services Addis Ababa',
      caption: 'Professional moving services in Addis Ababa',
      page: `${SITE_URL}/services`
    },
    {
      loc: `${SITE_URL}/images/6048392380857567570.jpg`,
      title: 'Packing Services Ethiopia',
      caption: 'Expert packing services across Ethiopia',
      page: `${SITE_URL}/services/packaging`
    },
    {
      loc: `${SITE_URL}/images/6048392380857567571.jpg`,
      title: 'Office Relocation Addis Ababa',
      caption: 'Complete office relocation services',
      page: `${SITE_URL}/services/office-relocation`
    },
    {
      loc: `${SITE_URL}/images/6048392380857567572.jpg`,
      title: 'Storage Solutions Ethiopia',
      caption: 'Secure storage solutions in Ethiopia',
      page: `${SITE_URL}/services/storage`
    },
    {
      loc: `${SITE_URL}/images/6048392380857567580.jpg`,
      title: 'Local Moving Services',
      caption: 'Local moving services in Addis Ababa',
      page: `${SITE_URL}/services/local-moving`
    },
    {
      loc: `${SITE_URL}/images/6048392380857567581.jpg`,
      title: 'Professional Moving Team',
      caption: 'Professional Ethiopian moving team',
      page: `${SITE_URL}/about`
    },
    {
      loc: `${SITE_URL}/images/gallery/1753769853063-xphwlpgvg6m.jpg`,
      title: 'Moving Gallery Addis Ababa',
      caption: 'Gallery of professional moving services',
      page: `${SITE_URL}/services`
    }
  ]

  const allImages = [...mainImages, ...galleryImages, ...testimonialImages, ...serviceImages]

  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
  const urlsetClose = '</urlset>'

  // Group images by page for better SEO structure
  const imagesByPage = allImages.reduce((acc, image) => {
    if (!acc[image.page]) {
      acc[image.page] = []
    }
    acc[image.page].push(image)
    return acc
  }, {} as Record<string, typeof allImages>)

  const imageEntries = Object.entries(imagesByPage).map(([page, images]) => {
    const imageElements = images.map(image => {
      return `      <image:image>
        <image:loc>${image.loc}</image:loc>
        <image:title>${escapeXml(image.title)}</image:title>
        <image:caption>${escapeXml(image.caption)}</image:caption>
      </image:image>`
    }).join('\n')

    return `  <url>
    <loc>${page}</loc>
${imageElements}
  </url>`
  }).join('\n')

  return `${xmlHeader}
${urlsetOpen}
${imageEntries}
${urlsetClose}`
}

export function generateSitemapIndex(): string {
  const now = new Date().toISOString()
  
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const sitemapindexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  const sitemapindexClose = '</sitemapindex>'

  const sitemaps = [
    {
      loc: `${SITE_URL}/sitemap.xml`,
      lastmod: now
    },
    {
      loc: `${SITE_URL}/sitemap-images.xml`,
      lastmod: now
    },
    {
      loc: `${SITE_URL}/sitemap-news.xml`,
      lastmod: now
    }
  ]

  const sitemapEntries = sitemaps.map(sitemap => {
    return `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`
  }).join('\n')

  return `${xmlHeader}
${sitemapindexOpen}
${sitemapEntries}
${sitemapindexClose}`
}

export function generateRobotsTxt(): string {
  const sitemapIndexUrl = `${SITE_URL}/sitemap-index.xml`
  
  return `User-agent: *
Allow: /

# Sitemap Index
Sitemap: ${sitemapIndexUrl}

# Crawl-delay
Crawl-delay: 1

# Disallow admin areas and private pages
Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/
Disallow: /_next/
Disallow: /_vercel/

# Allow important pages
Allow: /blog/
Allow: /services/
Allow: /about/
Allow: /contact/
Allow: /booking/
Allow: /privacy-policy/
Allow: /terms-of-service/

# Additional important pages
Allow: /sitemap.xml
Allow: /sitemap-images.xml
Allow: /robots.txt
Allow: /humans.txt

# Block sensitive files
Disallow: /.env
Disallow: /.git
Disallow: /package.json
Disallow: /package-lock.json`
}
