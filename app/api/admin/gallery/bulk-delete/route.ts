import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageIds } = body

    if (!imageIds || !Array.isArray(imageIds)) {
      return NextResponse.json(
        { error: 'Invalid image IDs' },
        { status: 400 }
      )
    }

    // Get images to delete
    const images = await prisma.galleryImage.findMany({
      where: { id: { in: imageIds } }
    })

    // Delete files from disk
    for (const image of images) {
      const filePath = path.join(process.cwd(), 'public', 'images', 'gallery', image.filename)
      try {
        await unlink(filePath)
      } catch (fileError) {
        console.warn('File not found on disk:', fileError)
      }
    }

    // Delete from database
    await prisma.galleryImage.deleteMany({
      where: { id: { in: imageIds } }
    })

    return NextResponse.json({ 
      message: `${images.length} images deleted successfully` 
    })
  } catch (error) {
    console.error('Error bulk deleting images:', error)
    return NextResponse.json(
      { error: 'Failed to delete images' },
      { status: 500 }
    )
  }
}
