import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'
import { generateSitemap, generateSitemapXML } from '@/lib/sitemap-generator'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'published'
      },
      include: {
        videos: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      titleAm,
      excerpt,
      excerptAm,
      content,
      contentAm,
      author,
      category,
      tags,
      tagsAm,
      readTime,
      featuredImage,
      images,
      videos,
      status = 'draft'
    } = body

    // Generate unique slug
    const baseSlug = generateSlug(title)
    let slug = baseSlug
    let counter = 1

    // Check if slug exists and make it unique
    while (await prisma.blogPost.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        titleAm: titleAm || '',
        excerpt,
        excerptAm: excerptAm || '',
        content,
        contentAm: contentAm || '',
        author,
        category,
        tags,
        tagsAm: tagsAm || [],
        readTime: readTime || 5,
        slug,
        featuredImage,
        images: images || [],
        status,
        videos: {
          create: videos?.map((video: any, index: number) => ({
            type: video.type,
            url: video.url,
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnail,
            embedCode: video.embedCode,
            order: index
          })) || []
        }
      },
      include: {
        videos: true
      }
    })

    // Update sitemap after creating new blog post
    try {
      const sitemapData = await generateSitemap()
      const xml = generateSitemapXML(sitemapData)
      
      // Write sitemap to public directory
      const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml')
      await fs.writeFile(sitemapPath, xml, 'utf-8')
      
      console.log('Sitemap updated successfully')
    } catch (sitemapError) {
      console.error('Error updating sitemap:', sitemapError)
      // Don't fail the blog creation if sitemap update fails
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
} 
 
 
 