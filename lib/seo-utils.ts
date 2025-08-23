import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  author?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  readTime?: number
  canonical?: string
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://activemoverset.com'
const SITE_NAME = 'Active Movers & Packers'
const DEFAULT_IMAGE = `${SITE_URL}/images/logo.jpg`

export function generateSEO(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    author,
    image = DEFAULT_IMAGE,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    section,
    tags = [],
    readTime,
    canonical
  } = config

  // Handle title formatting - if title already includes company name, use as is
  // Otherwise, add company name based on type
  let fullTitle = title
  if (!title.includes(SITE_NAME)) {
    if (type === 'article') {
      // For blog posts, use the format already set in the blog page
      fullTitle = title
    } else {
      // For other pages, add company name
      fullTitle = `${title} | ${SITE_NAME}`
    }
  }
  
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description,
      type,
      url: fullUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@activemoverset',
      site: '@activemoverset',
    },
    alternates: {
      canonical: canonical || fullUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      ...(section && { 'article:section': section }),
      ...(readTime && { 'article:read_time': readTime.toString() }),
      ...(author && { 'article:author': author }),
      ...(publishedTime && { 'article:published_time': publishedTime }),
      ...(modifiedTime && { 'article:modified_time': modifiedTime }),
      ...(tags.length > 0 && { 'article:tag': tags.join(', ') }),
    },
  }

  return metadata
}

export function generateArticleSchema(config: SEOConfig) {
  const {
    title,
    description,
    author,
    image,
    url,
    publishedTime,
    modifiedTime,
    section,
    tags,
    readTime
  } = config

  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image ? {
      "@type": "ImageObject",
      "url": image
    } : undefined,
    "author": author ? {
      "@type": "Person",
      "name": author
    } : undefined,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": DEFAULT_IMAGE
      }
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "url": fullUrl,
    "articleSection": section,
    "keywords": tags?.join(", "),
    "wordCount": Math.ceil(description.length / 5), // Rough estimate
    "timeRequired": readTime ? `PT${readTime}M` : undefined,
    "inLanguage": "en-US",
    "isAccessibleForFree": true
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": SITE_URL,
    "logo": DEFAULT_IMAGE,
    "description": "Professional moving and packing services in Addis Ababa, Ethiopia. Local moving, office relocation, packaging, and storage solutions.",
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
    ],
    "foundingDate": "2020",
    "numberOfEmployees": "10-50",
    "serviceArea": {
      "@type": "City",
      "name": "Addis Ababa"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Moving Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Local Moving",
            "description": "Professional local moving services in Addis Ababa"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Office Relocation",
            "description": "Complete office relocation and setup services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Packing Services",
            "description": "Professional packing and unpacking services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Storage Solutions",
            "description": "Secure storage facilities for your belongings"
          }
        }
      ]
    }
  }
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": SITE_NAME,
    "image": DEFAULT_IMAGE,
    "description": "Professional moving and packing services in Addis Ababa, Ethiopia. Local moving, office relocation, packaging, and storage solutions.",
    "url": SITE_URL,
    "telephone": "+251982260000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Beka Building",
      "addressLocality": "Addis Ababa",
      "addressRegion": "Addis Ababa",
      "addressCountry": "Ethiopia"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 9.0357937,
      "longitude": 38.8544868
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday", 
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "$$",
    "currenciesAccepted": "ETB, USD",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "areaServed": {
      "@type": "City",
      "name": "Addis Ababa"
    },
    "serviceArea": {
      "@type": "City",
      "name": "Addis Ababa"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Moving Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Local Moving",
            "description": "Professional local moving services"
          }
        }
      ]
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

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}
