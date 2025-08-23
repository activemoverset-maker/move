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

export function generateSitemap(): SitemapData {
  const now = new Date().toISOString()
  
  // IMPORTANT: Never include admin pages (/admin/*, /api/admin/*) in sitemap
  // They are blocked in robots.txt and should remain private
  const urls: SitemapUrl[] = [
    // Main pages (High Priority)
    {
      loc: `${SITE_URL}`,
      lastmod: now,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${SITE_URL}/services`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${SITE_URL}/booking`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${SITE_URL}/blog`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.8
    },
    
    // Service pages (Medium-High Priority)
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
    },
    
    // Information pages (Medium Priority)
    {
      loc: `${SITE_URL}/about`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${SITE_URL}/contact`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7
    },
    
    // Legal pages (Medium Priority)
    {
      loc: `${SITE_URL}/privacy-policy`,
      lastmod: now,
      changefreq: 'yearly',
      priority: 0.5
    },
    {
      loc: `${SITE_URL}/terms-of-service`,
      lastmod: now,
      changefreq: 'yearly',
      priority: 0.5
    },
    
    // SEO pages (Low Priority)
    {
      loc: `${SITE_URL}/sitemap.xml`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.3
    },
    {
      loc: `${SITE_URL}/robots.txt`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.1
    },
    {
      loc: `${SITE_URL}/humans.txt`,
      lastmod: now,
      changefreq: 'yearly',
      priority: 0.1
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

  // Add Amharic language alternatives for main pages
  const amharicUrls: SitemapUrl[] = [
    {
      loc: `${SITE_URL}/?lang=am`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${SITE_URL}/about?lang=am`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${SITE_URL}/services?lang=am`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${SITE_URL}/contact?lang=am`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${SITE_URL}/booking?lang=am`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${SITE_URL}/blog?lang=am`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.7
    }
  ]

  // Add Amharic service pages
  const amharicServiceUrls: SitemapUrl[] = [
    {
      loc: `${SITE_URL}/services/local-moving?lang=am`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${SITE_URL}/services/office-relocation?lang=am`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${SITE_URL}/services/packaging?lang=am`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${SITE_URL}/services/storage?lang=am`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7
    }
  ]

  // Combine all URLs
  urls.push(...amharicUrls, ...amharicServiceUrls)

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

export function generateNewsSitemap(): string {
  const now = new Date().toISOString()
  
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">'
  const urlsetClose = '</urlset>'

  const newsEntries = BLOG_POSTS.map(post => {
    return `  <url>
    <loc>${SITE_URL}/blog/${generateSlug(post.title)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml('Active Movers & Packers Blog')}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${post.publishedAt.toISOString()}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
      <news:keywords>${escapeXml(post.tags.join(', '))}</news:keywords>
    </news:news>
  </url>`
  }).join('\n')

  return `${xmlHeader}
${urlsetOpen}
${newsEntries}
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
