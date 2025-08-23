import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get gallery images from database
    const images = await prisma.galleryImage.findMany({
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
} 