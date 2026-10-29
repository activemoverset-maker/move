import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { generateSlug } from '@/lib/utils'
import { generateSitemap, generateSitemapXML } from '@/lib/sitemap-generator'
import { getAllGuides } from '@/lib/guide-data'

const GUIDES_DIR = path.join(process.cwd(), 'data', 'guides')

export async function GET() {
  try {
    const guides = getAllGuides().filter((g) => g.status === 'published')
    return NextResponse.json(guides)
  } catch (error) {
    console.error('Error fetching guides:', error)
    return NextResponse.json({ error: 'Failed to fetch guides' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      titleAm = '',
      excerpt,
      excerptAm = '',
      content,
      contentAm = '',
      author = 'Active Movers Team',
      category,
      tags = [],
      tagsAm = [],
      readTime = 10,
      featuredImage = '',
      images = [],
      status = 'draft',
      slug: slugInput,
    } = body

    if (!title?.trim() || !excerpt?.trim() || !content?.trim() || !category?.trim()) {
      return NextResponse.json({ error: 'Title, excerpt, content, and category are required' }, { status: 400 })
    }

    const validCategories = [
      'area-guide',
      'service-guide',
      'pricing-guide',
      'commercial-guide',
      'checklist-guide',
    ]
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    await fs.mkdir(GUIDES_DIR, { recursive: true })

    let slug = (slugInput?.trim() || generateSlug(title)).replace(/^-+|-+$/g, '')
    if (!slug) slug = generateSlug(title)

    const existing = getAllGuides()
    let counter = 1
    const baseSlug = slug
    while (existing.some((g) => g.slug === slug)) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const now = new Date().toISOString()
    const id = `guide-${slug}`.slice(0, 80)

    const jsonPost = {
      id,
      title: title.trim(),
      titleAm,
      excerpt: excerpt.trim(),
      excerptAm,
      content,
      contentAm,
      author,
      category,
      tags: Array.isArray(tags) ? tags : [],
      tagsAm: Array.isArray(tagsAm) ? tagsAm : [],
      readTime: Number(readTime) || 10,
      featuredImage: featuredImage || 'https://www.activemoverset.com/images/gallary/qua703.jpeg',
      images: Array.isArray(images) ? images : [],
      status,
      publishedAt: now,
      updatedAt: now,
      slug,
    }

    const filePath = path.join(GUIDES_DIR, `${slug}.json`)
    await fs.writeFile(filePath, JSON.stringify(jsonPost, null, 2), 'utf-8')

    if (status === 'published') {
      try {
        const sitemapData = await generateSitemap()
        const xml = generateSitemapXML(sitemapData)
        await fs.writeFile(path.join(process.cwd(), 'public', 'sitemap.xml'), xml, 'utf-8')
      } catch (sitemapError) {
        console.error('Error updating sitemap after guide create:', sitemapError)
      }
    }

    return NextResponse.json(jsonPost, { status: 201 })
  } catch (error) {
    console.error('Error creating guide:', error)
    return NextResponse.json({ error: 'Failed to create guide' }, { status: 500 })
  }
}
