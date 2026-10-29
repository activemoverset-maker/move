import { NextResponse } from 'next/server'
import { getAdminFromCookies } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma'
import { estimateEtbFromUsage } from '@/lib/telegram/analytics'
import { addisAbabaDayBounds } from '@/lib/telegram/time'

export async function GET() {
  const admin = await getAdminFromCookies()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const since24 = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const { start: todayStart, end: todayEnd } = addisAbabaDayBounds()

  const abandonedCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const [
    users,
    sessions,
    inIntake,
    abandonedIntakes,
    messages24h,
    handoffs24h,
    messagesToday,
    handoffsToday,
    usageRows24h,
  ] = await Promise.all([
    prisma.telegramUser.count(),
    prisma.telegramSession.count({ where: { status: 'active' } }),
    prisma.telegramSession.count({
      where: { status: 'active', intakeStep: { not: null } },
    }),
    prisma.telegramSession.count({
      where: {
        status: 'active',
        intakeStep: { not: null },
        intakeStartedAt: { lt: abandonedCutoff },
      },
    }),
    prisma.telegramMessage.count({ where: { createdAt: { gt: since24 } } }),
    prisma.telegramSession.count({
      where: { handoffAt: { gt: since24 } },
    }),
    prisma.telegramMessage.count({
      where: { createdAt: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.telegramSession.count({
      where: { handoffAt: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.telegramMessage.findMany({
      where: { createdAt: { gt: since24 } },
      select: {
        promptTokens: true,
        completionTokens: true,
        sttCharacters: true,
        ttsSeconds: true,
      },
    }),
  ])

  const countedAnswers24h = await prisma.telegramMessage.count({
    where: { countsTowardLimit: true, createdAt: { gt: since24 } },
  })

  const estimatedEtb24h = estimateEtbFromUsage(usageRows24h)

  return NextResponse.json({
    users,
    activeSessions: sessions,
    sessionsInIntake: inIntake,
    abandonedIntakes24h: abandonedIntakes,
    messages24h,
    countedAnswers24h,
    handoffs24h,
    messagesTodayAddis: messagesToday,
    handoffsTodayAddis: handoffsToday,
    estimatedEtb24h,
    timezone: 'Africa/Addis_Ababa',
  })
}
