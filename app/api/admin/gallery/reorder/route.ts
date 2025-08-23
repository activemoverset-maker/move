import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { images } = body

    if (!images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Invalid images data' },
        { status: 400 }
      )
    }

    // Update order for each image
    for (const image of images) {
      await prisma.galleryImage.update({
        where: { id: image.id },
        data: { order: image.order }
      })
    }

    return NextResponse.json({ 
      message: 'Images reordered successfully' 
    })
  } catch (error) {
    console.error('Error reordering images:', error)
    return NextResponse.json(
      { error: 'Failed to reorder images' },
      { status: 500 }
    )
  }
} 