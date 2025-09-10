"use client"

import Script from 'next/script'
import { generateFAQSchema } from '@/lib/seo-utils'

export function HomepageSEO() {
  const faqs = [
    {
      question: "What moving services do you offer in Addis Ababa?",
      answer: "We offer comprehensive moving services including local residential moving, office relocation, professional packing and unpacking, furniture assembly, and secure storage solutions throughout Addis Ababa and surrounding areas."
    },
    {
      question: "How far in advance should I book my move?",
      answer: "We recommend booking at least 1-2 weeks in advance for local moves. For office relocations or moves requiring special handling, booking 3-4 weeks ahead ensures better scheduling and preparation."
    },
    {
      question: "Are your moving services insured?",
      answer: "Yes, Active Movers & Packers is fully insured. We provide comprehensive coverage for your belongings during the entire moving process, giving you peace of mind throughout your relocation."
    },
    {
      question: "Do you provide packing materials?",
      answer: "Yes, we provide all necessary packing materials including boxes, tape, bubble wrap, protective materials, and specialized packaging for fragile items. Our professional packers use high-quality materials to ensure your belongings are safe."
    },
    {
      question: "What areas in Addis Ababa do you serve?",
      answer: "We serve all areas of Addis Ababa including Bole, Kazanchis, Piassa, CMC, Megenagna, and surrounding neighborhoods. We also provide moving services to nearby cities and towns."
    },
    {
      question: "Do you offer same-day moving services?",
      answer: "Yes, we offer same-day moving services for local moves depending on availability. Contact us early in the day for the best chance of securing same-day service for your urgent moving needs."
    }
  ]

  const faqSchema = generateFAQSchema(faqs)
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.activemoverset.com"
      }
    ]
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professional Moving Services",
    "description": "Comprehensive moving and packing services in Addis Ababa, Ethiopia",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Active Movers & Packers",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Beka Building",
        "addressLocality": "Addis Ababa",
        "addressCountry": "Ethiopia"
      },
      "telephone": "+251982260000"
    },
    "areaServed": {
      "@type": "City",
      "name": "Addis Ababa"
    },
    "serviceType": [
      "Local Moving",
      "Office Relocation", 
      "Packing Services",
      "Storage Solutions"
    ],
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "Contact for quote",
      "priceCurrency": "ETB"
    }
  }

  return (
    <>
      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
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

      {/* Service Schema */}
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
    </>
  )
}
