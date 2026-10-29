import { prisma } from '@/lib/prisma'
import { sendMessage, sendVoiceMultipart, TelegramApiError } from '@/lib/telegram/bot'

export async function markUserBlockedIfTelegram403(
  userId: string,
  error: unknown
): Promise<boolean> {
  if (error instanceof TelegramApiError && error.errorCode === 403) {
    await prisma.telegramUser.update({
      where: { id: userId },
      data: { isBlocked: true },
    })
    return true
  }
  return false
}

export async function sendMessageToUser(
  userId: string,
  chatId: string,
  text: string
): Promise<{ message_id: number } | null> {
  try {
    return await sendMessage(chatId, text)
  } catch (e) {
    if (await markUserBlockedIfTelegram403(userId, e)) return null
    throw e
  }
}

export async function sendVoiceToUser(
  userId: string,
  chatId: string,
  audio: Buffer,
  options?: { caption?: string }
): Promise<{ message_id: number } | null> {
  try {
    return await sendVoiceMultipart(chatId, audio, options)
  } catch (e) {
    if (await markUserBlockedIfTelegram403(userId, e)) return null
    throw e
  }
}
