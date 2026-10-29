import { prisma } from '@/lib/prisma'
import type { TelegramUser as TgFrom } from '@/lib/telegram/types'
import { parsePhone } from '@/lib/telegram/intake/validate'

export { parsePhone }

export async function getOrCreateUserFrom(from: TgFrom, chatId: string) {
  const telegramUserId = String(from.id)

  let user = await prisma.telegramUser.findUnique({ where: { telegramUserId } })
  if (!user) {
    user = await prisma.telegramUser.create({
      data: {
        telegramUserId,
        chatId,
        username: from.username,
        firstName: from.first_name,
        lastName: from.last_name,
        displayName:
          from.first_name && from.first_name.length >= 2 ? from.first_name : undefined,
        awaitingName: !(from.first_name && from.first_name.length >= 2),
      },
    })
  } else {
    user = await prisma.telegramUser.update({
      where: { id: user.id },
      data: {
        chatId,
        username: from.username,
        firstName: from.first_name,
        lastName: from.last_name,
        lastSeenAt: new Date(),
        isBlocked: false,
      },
    })
  }
  return user
}

export async function getActiveSession(userId: string) {
  let session = await prisma.telegramSession.findFirst({
    where: { userId, status: 'active' },
    orderBy: { createdAt: 'desc' },
  })
  if (!session) {
    session = await prisma.telegramSession.create({
      data: { userId, status: 'active' },
    })
  }
  return session
}
