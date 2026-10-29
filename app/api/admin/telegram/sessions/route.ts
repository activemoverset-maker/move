import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromCookies } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const admin = await getAdminFromCookies()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit') || 25), 50)
  const cursor = request.nextUrl.searchParams.get('cursor')

  const sessions = await prisma.telegramSession.findMany({
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { updatedAt: 'desc' },
    include: {
      user: {
        select: {
          telegramUserId: true,
          username: true,
          displayName: true,
          firstName: true,
          isBlocked: true,
        },
      },
      messages: {
        where: { countsTowardLimit: true },
        select: { id: true },
      },
    },
  })

  let nextCursor: string | null = null
  if (sessions.length > limit) {
    const next = sessions.pop()
    nextCursor = next?.id ?? null
  }

  return NextResponse.json({
    sessions: sessions.map((s) => ({
      id: s.id,
      status: s.status,
      phone: s.phone,
      handoffReason: s.handoffReason,
      handoffAt: s.handoffAt,
      intakeStep: s.intakeStep,
      updatedAt: s.updatedAt,
      user: s.user,
      countedAnswersInSession: s.messages.length,
    })),
    nextCursor,
  })
}
