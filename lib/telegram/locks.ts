import { prisma } from '@/lib/prisma'

const LOCK_MS = 2 * 60 * 1000

export async function tryAcquireTurnLock(userId: string): Promise<boolean> {
  const now = new Date()
  const until = new Date(now.getTime() + LOCK_MS)

  const user = await prisma.telegramUser.findUnique({ where: { id: userId } })
  if (!user) return false
  if (user.processingUntil && user.processingUntil > now) {
    return false
  }

  await prisma.telegramUser.update({
    where: { id: userId },
    data: { processingUntil: until },
  })
  return true
}

export async function releaseTurnLock(userId: string): Promise<void> {
  await prisma.telegramUser.update({
    where: { id: userId },
    data: { processingUntil: null },
  })
}

/** Short transaction: advisory lock + read caps only (no HTTP). */
export async function readCapsUnderLock(telegramUserId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`tg-user:${telegramUserId}`}))`
    const since24 = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const since10 = new Date(Date.now() - 10 * 60 * 1000)
    const counted24h = await tx.telegramMessage.count({
      where: { userId, countsTowardLimit: true, createdAt: { gt: since24 } },
    })
    const counted10m = await tx.telegramMessage.count({
      where: { userId, countsTowardLimit: true, createdAt: { gt: since10 } },
    })
    return { counted24h, counted10m }
  })
}

export async function markMessageCounted(
  telegramUserId: string,
  userId: string,
  telegramMessageId: string
) {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`tg-user:${telegramUserId}`}))`
    await tx.telegramMessage.updateMany({
      where: { userId, telegramMessageId, countsTowardLimit: false },
      data: { countsTowardLimit: true },
    })
  })
}
