import { NextResponse } from 'next/server'
import { getAdminFromCookies } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma'
import { estimateEtbFromUsage } from '@/lib/telegram/analytics'
import { formatIntakeBlock } from '@/lib/telegram/intake/format'
import { parseIntakeData } from '@/lib/telegram/intake/types'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromCookies()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await context.params

  const session = await prisma.telegramSession.findUnique({
    where: { id },
    include: {
      user: true,
      messages: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!session) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const counted24h = await prisma.telegramMessage.count({
    where: {
      userId: session.userId,
      countsTowardLimit: true,
      createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  })

  const intakeData = parseIntakeData(session.intakeData)
  const intakeSummary =
    session.intakeData || session.fromAddress
      ? formatIntakeBlock(
          {
            ...intakeData,
            fromLocation: intakeData.fromLocation ?? session.fromAddress ?? undefined,
            toLocation: intakeData.toLocation ?? session.toAddress ?? undefined,
            moveDate: intakeData.moveDate ?? session.moveDate ?? undefined,
          },
          session.phone
        )
      : null

  return NextResponse.json({
    session: {
      id: session.id,
      status: session.status,
      phone: session.phone,
      fromAddress: session.fromAddress,
      toAddress: session.toAddress,
      handoffReason: session.handoffReason,
      handoffAt: session.handoffAt,
      intakeStep: session.intakeStep,
      intakeData: session.intakeData,
      intakeStartedAt: session.intakeStartedAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    },
    user: {
      telegramUserId: session.user.telegramUserId,
      username: session.user.username,
      displayName: session.user.displayName,
      firstName: session.user.firstName,
      isBlocked: session.user.isBlocked,
      lastSeenAt: session.user.lastSeenAt,
    },
    countedAnswers24h: counted24h,
    estimatedEtb: estimateEtbFromUsage(session.messages),
    intakeSummary,
    messages: session.messages.map((m) => ({
      id: m.id,
      role: m.role,
      kind: m.kind,
      text: m.text,
      countsTowardLimit: m.countsTowardLimit,
      createdAt: m.createdAt,
      promptTokens: m.promptTokens,
      completionTokens: m.completionTokens,
      sttCharacters: m.sttCharacters,
      ttsSeconds: m.ttsSeconds,
    })),
  })
}
