import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'

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
        titleAm,
        excerpt,
        excerptAm,
        content,
        contentAm,
        author,
        category,
        tags,
        tagsAm,
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

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
} 
 
 
 