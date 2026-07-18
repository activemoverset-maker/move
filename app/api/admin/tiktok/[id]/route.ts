import { NextRequest, NextResponse } from 'next/server'
import { deleteTikTokVideo, updateTikTokVideo } from '@/lib/tiktok/service'
import { mapTikTokVideoToPublic } from '@/lib/tiktok/map'
import { isValidTikTokCategory } from '@/lib/tiktok/categories'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const patch: Parameters<typeof updateTikTokVideo>[1] = {}

    if (typeof body.title === 'string') patch.title = body.title.trim()
    if (typeof body.titleAm === 'string') patch.titleAm = body.titleAm.trim() || null
    if (typeof body.description === 'string') patch.description = body.description.trim() || null
    if (typeof body.descriptionAm === 'string') patch.descriptionAm = body.descriptionAm.trim() || null
    if (typeof body.isFeatured === 'boolean') patch.isFeatured = body.isFeatured
    if (typeof body.isPinned === 'boolean') patch.isPinned = body.isPinned
    if (typeof body.isActive === 'boolean') patch.isActive = body.isActive
    if (typeof body.order === 'number') patch.order = body.order
    if (typeof body.category === 'string' && isValidTikTokCategory(body.category)) {
      patch.category = body.category
    }

    const updated = await updateTikTokVideo(id, patch)
    return NextResponse.json(mapTikTokVideoToPublic(updated))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update video'
    console.error('PATCH /api/admin/tiktok/[id] error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteTikTokVideo(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/tiktok/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 404 })
  }
}
