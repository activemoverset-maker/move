export interface BlogPostSchema {
  title: string
  description: string
  author: string
  publishedAt: string
  modifiedAt: string
  image?: string
  url: string
  readTime: number
  category: string
  tags: string[]
}

export function generateBlogPostSchema(post: BlogPostSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Active Movers & Packers",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.activemoverset.com/images/logo.jpg"
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.modifiedAt,
    "image": post.image ? {
      "@type": "ImageObject",
      "url": post.image
    } : undefined,
    "url": post.url,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": post.url
    },
    "articleSection": post.category,
    "keywords": post.tags.join(", "),
    "wordCount": Math.ceil(post.description.length / 5), // Rough estimate
    "timeRequired": `PT${post.readTime}M`,
    "inLanguage": "en-US",
    "isAccessibleForFree": true
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Active Movers & Packers",
    "url": "https://www.activemoverset.com",
    "logo": "https://www.activemoverset.com/images/logo.jpg",
    "description": "Professional moving and packing services in Addis Ababa, Ethiopia",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Beka Building",
      "addressLocality": "Addis Ababa",
      "addressCountry": "Ethiopia"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+251982260000",
      "contactType": "customer service",
      "availableLanguage": ["English", "Amharic"]
    },
    "sameAs": [
      "https://facebook.com/activemoverset",
      "https://instagram.com/activemoverset",
      "https://twitter.com/activemoverset"
    ]
  }
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Active Movers & Packers",
    "url": "https://www.activemoverset.com",
    "description": "Professional moving and packing services in Addis Ababa, Ethiopia",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.activemoverset.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}
