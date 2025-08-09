import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { PrismaClient } from '@prisma/client'

// Ensure this route always runs on the Node.js runtime and is never statically evaluated
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Lazy-load sharp at runtime to avoid bundling/loading during build
    const sharp = (await import('sharp')).default
    const formData = await request.formData()
    const files = formData.getAll('images') as File[]
    const title = formData.get('title') as string
    const titleAm = formData.get('titleAm') as string
    const description = formData.get('description') as string
    const descriptionAm = formData.get('descriptionAm') as string
    const category = formData.get('category') as string
    const categoryAm = formData.get('categoryAm') as string
    const alt = formData.get('alt') as string

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      )
    }

    // Create gallery directory if it doesn't exist
    const galleryDir = path.join(process.cwd(), 'public', 'images', 'gallery')
    await mkdir(galleryDir, { recursive: true })

    const uploadedImages = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = path.extname(file.name)
      const filename = `${timestamp}-${randomString}${extension}`

      // Get image dimensions and optimize
      const buffer = Buffer.from(await file.arrayBuffer())
      const image = sharp(buffer)
      const metadata = await image.metadata()
      
      // Resize image if too large (max 1920px width)
      let processedBuffer = buffer
      if (metadata.width && metadata.width > 1920) {
        processedBuffer = await image
          .resize(1920, null, { withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer()
      }

      // Save file to disk
      const filePath = path.join(galleryDir, filename)
      await writeFile(filePath, processedBuffer)

      // Get final file size
      const finalFileSize = processedBuffer.length

      // Save to database
      const galleryImage = await prisma.galleryImage.create({
        data: {
          filename,
          title: title || path.parse(file.name).name,
          titleAm: titleAm || path.parse(file.name).name,
          description: description || '',
          descriptionAm: descriptionAm || '',
          category: category || 'Moving Services',
          categoryAm: categoryAm || 'የመጓጓዣ አገልግሎቶች',
          alt: alt || path.parse(file.name).name,
          fileSize: finalFileSize,
          dimensions: {
            width: metadata.width || 0,
            height: metadata.height || 0
          },
          order: 0 // Will be updated later
        }
      })

      uploadedImages.push(galleryImage)
    }

    // Update order for uploaded images
    const totalImages = await prisma.galleryImage.count()
    for (let i = 0; i < uploadedImages.length; i++) {
      await prisma.galleryImage.update({
        where: { id: uploadedImages[i].id },
        data: { order: totalImages - uploadedImages.length + i }
      })
    }

    return NextResponse.json({
      message: `${uploadedImages.length} images uploaded successfully`,
      images: uploadedImages
    })

  } catch (error) {
    console.error('Error uploading images:', error)
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    )
  }
} 